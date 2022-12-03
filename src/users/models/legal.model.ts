import { randomUUID } from "crypto";
import { BelongsTo, Column, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";


/**
 * Legal Model. 1:1 relation with User
 */

@Table
export class Legal extends Model {
    @IsUUID(4)
    @PrimaryKey
    @Default(randomUUID)
    @Column
    legalId: string;

    @Column
    privacyAcceptedAt: Date;

    @Column
    privacyUpdateReq: boolean;

    @Column
    termsAcceptedAt: Date;

    @Column
    termsUpdateReq: boolean;

    
    @ForeignKey(() => User)
    @Column
    userId: string

    @BelongsTo(() => User)
    user: User;

}