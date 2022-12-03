import { Action } from "src/casl/actions";
import { AppAbility } from "src/casl/casl-ability.factory";
import { UserPermission } from "src/permissions/models/permissions.model";
import { IPolicyHandler } from "./policies.interfaces";

export class ReadOwnPermissionsPolicy implements IPolicyHandler {
    handle(ability: AppAbility, entities?: UserPermission[] | UserPermission): boolean {
        return ability.can(Action.READ, entities);
    }
    
}