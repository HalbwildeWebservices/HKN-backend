import { AppAbility } from "src/casl/casl-ability.factory";
import { PaddleEvent } from "src/paddle-event/models/paddle-event.model";
import { UserPermission } from "src/permissions/models/permissions.model";
import { PhoneNumber } from "src/phoneNumbers/models/phoneNumber.model";

export interface IPolicyHandler {
    handle(ability: AppAbility, entities?: UserPermission | UserPermission[] | PhoneNumber | PaddleEvent): boolean;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;