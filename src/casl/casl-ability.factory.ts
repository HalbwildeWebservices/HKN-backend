import { Ability, AbilityBuilder, InferSubjects, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { Injectable, Logger } from "@nestjs/common";
import { EPermission } from "hkn-common";
import { Action } from "./actions";
import { UserPermission } from "src/permissions/models/permissions.model";
import { User } from "src/users/models/user.model";
import { PhoneNumber } from "src/phoneNumbers/models/phoneNumber.model";


type Subjects = InferSubjects<
    typeof User
    | typeof UserPermission 
    | typeof PhoneNumber
    | typeof Array<UserPermission> 
    | 'all'
>
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    private readonly logger = new Logger('Casl Ability Factory');

    abilitiesForUser(user: User) {
        const { can, build } = new AbilityBuilder<
        Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        this.logger.log(JSON.stringify(user))
        const permissionList = user.permissions.map((p) => p.name);
        if (permissionList.includes(EPermission.READ_USER)) {
            can([Action.READ, Action.LIST], User);
        }
        if (permissionList.includes(EPermission.DELETE_USER)) {
            can(Action.DELETE, [User, PhoneNumber]);
        }
        if (permissionList.includes(EPermission.MANAGE_PERMISSION)) {
            can(Action.MANAGE, UserPermission);
        }
        if (permissionList.includes(EPermission.READ_PERMISSION)) {
            can(Action.READ, UserPermission);
        }
        if (permissionList.includes(EPermission.ADD_USER)) {
            can(Action.CREATE, [User, PhoneNumber]);
        }
        if (permissionList.includes(EPermission.UPDATE_USER)) {
            can(Action.UPDATE, [User, PhoneNumber]);
        }
        //read, update, delete self
        can([Action.READ, Action.UPDATE, Action.DELETE], User, {userId: user.userId});
        //read own permissions
        can(Action.READ, UserPermission, {userId: user.userId});
        can(Action.READ, Array<UserPermission>, {every: {userId: user.userId}});
        //manage own phone numbers
        can(Action.MANAGE, PhoneNumber, {userId: user.userId});
        

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
        });

    }
}
