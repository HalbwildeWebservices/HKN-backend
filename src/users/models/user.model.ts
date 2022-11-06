import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Column, IsUUID, Model, PrimaryKey, Table, Unique, ForeignKey, HasMany, BelongsTo, Default, HasOne } from 'sequelize-typescript';
import { Address } from './address.model';
import { PhoneNumber } from './phoneNumber.model';

@Table
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(randomUUID)
  @Column
  userId: string;

  @ApiProperty({example: 'Manfred Mustermann', description: 'chosen username'})
  @Unique
  @Column
  username: string;
  
  @ApiProperty({example: 'Manfred', description: 'first name(s)'})
  @Column
  firstName: string;

  @ApiProperty({example: 'Mustermann', description: 'last name(s)'})
  @Column
  lastName: string;

  @Column({ defaultValue: true })
  isActive: boolean;

  @Column
  password: string;

  @Column
  email: string;

  @HasMany(() => UserPermission)
  permissions: UserPermission[];

  @HasOne(() => Address)
  address: Address;

  @HasMany(() => PhoneNumber)
  phoneNumbers: PhoneNumber[];
}

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
