import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PhoneNumberService } from 'src/phoneNumbers/phone-number.service';
import { User } from 'src/users/models/user.model';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import {
  PhoneNumbersPolicy,
  PermissionsPolicy,
} from './policies.classes';
import { PolicyHandler } from './policies.interfaces';

interface IRequestParams {
  phoneId?: string;
  userId?: string;
  permissionId?: string;
}

@Injectable()
export class PoliciesGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger('PoliciesGuard');
  private permissionService: PermissionsService;
  private phoneNumberService: PhoneNumberService;

  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private moduleRef: ModuleRef,
  ) { }

  onModuleInit() {
    this.permissionService = this.moduleRef.get(PermissionsService, {strict: false});
    this.phoneNumberService = this.moduleRef.get(PhoneNumberService, {strict: false});
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      ) || [];

    //user: the logged-in user
    //userId: the userId from the request
    //phoneId: the phoneId from the request
    const { user, params } = context
      .switchToHttp()
      .getRequest<{ user?: User; params?: IRequestParams }>();
    if (!user) {
      return false;
    }
    this.logger.log(`loggedIn user ${user.username} ${user.userId}`);
    this.logger.log(`userId param ${params.userId}`);
    const ability = this.caslAbilityFactory.abilitiesForUser(user);

    const handlerResults = policyHandlers.map((h) =>
      this.execPolicyHandler(h, ability, params)
    );
    return Promise.all(handlerResults)
      .then((res) => {
        return res.every((r) => r === true);
      })
      .catch((err) => {
        this.logger.error(
          `error checking policies: ${err?.message ?? 'unknown error'}`
        );
        return false;
      });
  }

  private async execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    params: IRequestParams
  ): Promise<boolean> {
    if (typeof handler === 'function') {
      return handler(ability);
    } else if (handler instanceof PermissionsPolicy &&  params.permissionId !== undefined) {
      //check if logged-in user can access permission with given permissionId
      try {
        const permission = await this.permissionService.getPermissionsById(
          params.permissionId
        );
        return handler.handle(ability, permission);
      } catch (err) {
        this.logger.error(
          `error fetching permission: ${err?.message ?? 'unknown error'}`
        );
        return false;
      }
    } else if (handler instanceof PermissionsPolicy &&  params.userId !== undefined) {
      //check if logged-in user can access permissions of user with given userId
      try {
        const permissions = await this.permissionService.getPermissionsByUser(
          params.userId
        );
        //TODO couldn't make it work with Permission array so far
        return permissions.every((p) => handler.handle(ability, p));
      } catch (err) {
        this.logger.error(
          `error fetching permissions: ${err?.message ?? 'unknown error'}`
        );
        return false;
      }
    } else if (handler instanceof PhoneNumbersPolicy &&  params.phoneId !== undefined) {
      //check if logged-in user can access specific phone number
      try {
        const phoneNumber = await this.phoneNumberService.findPhoneNumber(
          params.phoneId
        );
        return handler.handle(ability, phoneNumber);
      } catch (err) {
        this.logger.error(
          `error fetching phone number: ${err?.message ?? 'unknown error'}`
        );
        return false;
      }
    } else if (handler instanceof PhoneNumbersPolicy && params.userId !== undefined) {
        //check if logged-in user can access phone numbers of user with given userId
        try {
          const phoneNumbers = await this.phoneNumberService.getPhoneNumbersByUser(params.userId);
          return phoneNumbers.every((p) => handler.handle(ability, p));
        } catch (err) {
          this.logger.error(
            `error fetching phone numbers: ${err?.message ?? 'unknown error'}`
          );
          return false;
        }
    } else {
      return false;
    }
  }
}
