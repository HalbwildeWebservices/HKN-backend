import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import { ReadOwnPermissionsPolicy } from './policies.classes';
import { PolicyHandler } from './policies.interfaces';

@Injectable()
export class PoliciesGuard implements CanActivate {
  private readonly logger = new Logger('PoliciesGuard'); 

  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private permissionService: PermissionsService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    ) || [];
    
    //user: the logged-in user
    //userId: the userId from the request
    
    const { user, params } = context.switchToHttp().getRequest<{user: UserResponseDto, params?: {userId?: string}}>();
    if (!user) {
      return false;
    }
    this.logger.log(`loggedIn user ${user.username} ${user.userId}`);
    this.logger.log(`userId param ${params.userId}`)
    const ability = this.caslAbilityFactory.abilitiesForUser(user);

    const handlerResults = policyHandlers.map((h) => this.execPolicyHandler(h, ability, params.userId));
    return Promise.all(handlerResults).then((res) => {return res.every((r) => r === true)})

    //const canActivate = (await Promise.all(handlerResultPromises)).every((p) => p === true);
    //return canActivate;
    //return await policyHandlers.every(async (handler) => await this.execPolicyHandler(handler, ability, params.userId));
  }
  
  private async execPolicyHandler(handler: PolicyHandler, ability: AppAbility, userId: string | undefined) {
    if (typeof handler === 'function') {
      return handler(ability);
    } else if (handler instanceof ReadOwnPermissionsPolicy && userId !== undefined) {
        //couldn't make it work with Permission array so far
        const permissions = await this.permissionService.getPermissionsByUser(userId);
        return permissions.every((p) => handler.handle(ability, p));

    } else {
       return false;
    }
    
  }

}
