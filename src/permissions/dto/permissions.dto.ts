import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, IsEnum,  } from "class-validator";
import { EPermission, IPermission } from "hkn-common";
import { UserPermission } from "../models/permissions.model";

export class SetPermissionsDto {
    @ApiProperty({
        example: [EPermission.DEFAULT, EPermission.ADD_USER], 
        description: "permission list", 
        enum: EPermission,
        isArray: true,
    })
    @IsNotEmpty()
    @IsArray()
    @IsEnum(EPermission, {each: true})
    permissions: string[]
}

export class PermissionResponseDto implements IPermission {
    permissionId: string;
    name: string;

    constructor(userPermission: UserPermission) {
        this.permissionId = userPermission.permissionId;
        this.name = userPermission.name;
    }
}