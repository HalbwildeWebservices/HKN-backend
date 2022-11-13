import { Table, Model, PrimaryKey, Default, Column, ForeignKey, BelongsTo } from "sequelize-typescript";
import { IsUUID } from "class-validator";
import { User } from "src/users/models/user.model";
import { randomUUID } from "crypto";
//import { EPermission, IPermission } from 'hkn-common';

@Table
export class UserPermission extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(randomUUID)
  @Column
  permissionId: string;
  
  @Column
  name: string;

  @ForeignKey(() => User)
  @Column
  userId: string

  @BelongsTo(() => User)
  user: User;
}