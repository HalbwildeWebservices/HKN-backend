import { Action } from 'src/casl/actions';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { UserPermission } from 'src/permissions/models/permissions.model';
import { PhoneNumber } from 'src/phoneNumbers/models/phoneNumber.model';
import { IPolicyHandler } from './policies.interfaces';

export class PermissionsPolicy implements IPolicyHandler {
  private readonly action: Action;
  
  constructor(action: Action) {
    this.action = action;
  }

  handle(
    ability: AppAbility,
    entities?: UserPermission[] | UserPermission
  ): boolean {
    return ability.can(this.action, entities);
  }
}

export class PhoneNumbersPolicy implements IPolicyHandler {
  private readonly action: Action;
  
  constructor(action: Action) {
    this.action = action;
  }
  
  handle(ability: AppAbility, entities?: PhoneNumber): boolean {
    return ability.can(this.action, entities);
  }
}
