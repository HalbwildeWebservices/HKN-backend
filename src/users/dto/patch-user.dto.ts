import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString } from "class-validator";
import { CreateAddressDto } from "./create-address.dto";
import { CreateLegalDto } from "./create-legal.dto";


export class PatchUserDto {
    @ApiProperty({example: 'Manfred', description: "new first name", required: false})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty({example: 'Mustermann', description: "new last name / family name", required: false})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @ApiProperty({example: "website@halbwilde.com", description: "new email address", required: false})
    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({description: 'address', required: false})
    @IsOptional()
    @IsNotEmptyObject()
    readonly address?: CreateAddressDto; 

    @ApiProperty({description: 'accept terms of use and privacy declaration'})
    readonly legal: CreateLegalDto;
}