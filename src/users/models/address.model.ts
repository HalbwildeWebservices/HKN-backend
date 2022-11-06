import { randomUUID } from "crypto";
import { BelongsTo, Column, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { IAddress } from "hkn-common";

@Table
export class Address extends Model implements IAddress {
    @IsUUID(4)
    @PrimaryKey
    @Default(randomUUID)
    @Column
    addressId: string;

    @Column
    street: string;

    @Column
    houseNumber: string;

    @Column
    zipCode: string;

    @Column
    town: string;

    @Column
    country: string;
    
    @ForeignKey(() => User)
    @Column
    userId: string

    @BelongsTo(() => User)
    user: User;

}