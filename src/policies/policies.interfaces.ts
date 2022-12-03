import { AppAbility } from "src/casl/casl-ability.factory";
import { UserPermission } from "src/permissions/models/permissions.model";

export interface IPolicyHandler {
    handle(ability: AppAbility, entities?: UserPermission | UserPermission[]): boolean;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;