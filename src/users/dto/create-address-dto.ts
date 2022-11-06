import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAddressDto {
    @ApiProperty({example: "Bundesstrasse B498", description: "street"})
    @IsNotEmpty()
    readonly street: string;

    @ApiProperty({example: "1", description: "house number"})
    @IsNotEmpty()
    readonly houseNumber: string;

    @ApiProperty({example: "38642", description: "zip code"})
    @IsNotEmpty()
    readonly zipCode: string;

    @ApiProperty({example: "Goslar", description: "town"})
    @IsNotEmpty()
    readonly town: string;

    @ApiProperty({example: "Germany", description: "country"})
    @IsNotEmpty()
    readonly country: string;

}