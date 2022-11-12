import { randomUUID } from "crypto";
import { BelongsTo, Column, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { IPhoneNumber } from 'hkn-common'


@Table
export class PhoneNumber extends Model implements IPhoneNumber{
    @IsUUID(4)
    @PrimaryKey
    @Default(randomUUID)
    @Column
    phoneId: string
    
    @Column
    number: string;

    @Column
    description: string;

    @ForeignKey(() => User)
    @Column
    userId: string

    @BelongsTo(() => User)
    user: User;
}