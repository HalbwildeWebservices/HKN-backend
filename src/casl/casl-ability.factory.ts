import { Ability, AbilityBuilder, InferSubjects, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { Injectable, Logger } from "@nestjs/common";
import { EPermission } from "hkn-common";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { SetPermissionsDto } from "src/permissions/dto/permissions.dto"
import { Action } from "./actions";
import { UserPermission } from "src/permissions/models/permissions.model";


type Subjects = InferSubjects<
    typeof UserResponseDto 
    | typeof SetPermissionsDto 
    | typeof UserPermission 
    | typeof Array<UserPermission> 
    | 'all'
>
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    private readonly logger = new Logger('Casl Ability Factory');

    abilitiesForUser(user: UserResponseDto) {
        const { can, build } = new AbilityBuilder<
        Ability<[Action, Subjects]>
        >(Ability as AbilityClass<AppAbility>);

        this.logger.log(JSON.stringify(user))
        const permissionList = user.permissions.map((p) => p.name);
        if (permissionList.includes(EPermission.READ_USER)) {
            can(Action.READ, UserResponseDto);
        }
        if (permissionList.includes(EPermission.DELETE_USER)) {
            can(Action.DELETE, UserResponseDto);
        }
        if (permissionList.includes(EPermission.MANAGE_PERMISSION)) {
            can(Action.MANAGE, SetPermissionsDto);
            can(Action.MANAGE, UserPermission);
        }
        if (permissionList.includes(EPermission.READ_PERMISSION)) {
            can(Action.READ, SetPermissionsDto);
            can(Action.READ, UserPermission);
        }
        if (permissionList.includes(EPermission.ADD_USER)) {
            can([Action.CREATE, Action.READ], UserResponseDto);
        }
        if (permissionList.includes(EPermission.UPDATE_USER)) {
            can([Action.UPDATE, Action.READ], UserResponseDto);
        }
        //read, update, delete self
        can([Action.READ, Action.UPDATE, Action.DELETE], UserResponseDto, {userId: user.userId});
        //read own permissions
        can(Action.READ, UserPermission, {userId: user.userId});
        can(Action.READ, Array<UserPermission>, {every: {userId: user.userId}});
        

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
        });

    }
}
