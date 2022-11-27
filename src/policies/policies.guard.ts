import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Action } from 'src/casl/actions';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { CHECK_POLICIES_KEY } from './check-policies.decorator';
import { PolicyHandler } from './policies.interfaces';

@Injectable()
export class PoliciesGuard implements CanActivate {
  private readonly logger = new Logger('PoliciesGuard'); 

  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    ) || [];

    this.logger.log(`found ${policyHandlers.length} handlers`)
    const { user }= context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    const ability = this.caslAbilityFactory.abilitiesForUser(user);
    this.logger.log(ability.can(Action.READ, UserResponseDto));

    return policyHandlers.every((handler) => this.execPolicyHandler(handler, ability));
  }
  
  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }

}
