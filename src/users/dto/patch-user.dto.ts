import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class PatchUserDto {
    @ApiProperty({example: 'Manfred', description: "new user's first name"})
    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty({example: 'Mustermann', description: "new user's last name / family name"})
    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @ApiProperty({example: "website@halbwilde.com", description: "email address"})
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;


}