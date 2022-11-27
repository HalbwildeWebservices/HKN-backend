import { Ability, AbilityBuilder, InferSubjects, AbilityClass, ExtractSubjectType } from "@casl/ability";
import { Injectable, Logger } from "@nestjs/common";
import { EPermission } from "hkn-common";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { Action } from "./actions";


type Subjects = InferSubjects<typeof UserResponseDto> | 'all'
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
        can(Action.DELETE, UserResponseDto, {userId: user.userId});
        can(Action.UPDATE, UserResponseDto, {userId: user.userId});

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
        });

    }
}
