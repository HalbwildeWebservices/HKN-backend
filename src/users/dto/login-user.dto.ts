import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, } from "class-validator";


export class LoginUserDto {
    @ApiProperty({example: 'Manfred Mustermann', description: 'public username'})
    @IsString()
    @IsNotEmpty()
    readonly username: string

    @ApiProperty({example: 'SuperStrongAndLongEasyToRememberPassword', description: 'initial password'})
    @IsString()
    @IsNotEmpty()
    readonly password: string

}
