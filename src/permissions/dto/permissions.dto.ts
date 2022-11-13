import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray, IsEnum,  } from "class-validator";
import { EPermission } from "hkn-common";

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