import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsArray } from "class-validator";

export class SetPermissionsDto {
    @ApiProperty({example: '["read_user"]', description: "permission list", type: [String]})
    @IsNotEmpty()
    @IsArray()
    permissions: string[]
}