import { randomUUID } from "crypto";
import { ILegal } from "hkn-common/dist/src/legal";
import { BelongsTo, Column, Default, ForeignKey, IsUUID, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";


/**
 * Legal Model. 1:1 relation with User
 */

@Table
export class Legal extends Model implements Omit<ILegal, 'createdAt' | 'updatedAt'> {
    @IsUUID(4)
    @PrimaryKey
    @Default(randomUUID)
    @Column
    legalId: string;

    @Default(() => {return new Date()})
    @Column
    privacyAcceptedAt: Date;

    @Default(false)
    @Column
    privacyUpdateReq: boolean;

    @Default(() => {return new Date()})
    @Column
    termsAcceptedAt: Date;

    @Default(false)
    @Column
    termsUpdateReq: boolean;

    
    @ForeignKey(() => User)
    @Column
    userId: string

    @BelongsTo(() => User)
    user: User;
}