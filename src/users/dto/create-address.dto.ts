import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { IAddress, ICreateAddressRequest } from "hkn-common";
import { Address } from "../models/address.model";

export class CreateAddressDto implements ICreateAddressRequest {
    @ApiProperty({example: "Romkerhalle", description: "street"})
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

export class AdressResponseDto implements IAddress {
    addressId: string;
    street: string;
    houseNumber: string;
    zipCode: string;
    town: string;
    country: string;
    
    constructor(address: Address) {
        const values = address.get()
        Object.assign(this, values);

    }
}