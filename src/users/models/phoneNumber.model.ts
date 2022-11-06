import { randomUUID } from "crypto";
import { BelongsTo, Column, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table
export class PhoneNumber extends Model{
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