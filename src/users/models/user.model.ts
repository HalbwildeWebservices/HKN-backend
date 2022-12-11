import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Column, IsUUID, Model, PrimaryKey, Table, Unique, HasMany, Default, HasOne, BelongsToMany } from 'sequelize-typescript';
import { Address } from './address.model';
import { PhoneNumber } from '../../phoneNumbers/models/phoneNumber.model';
import { UserPermission } from 'src/permissions/models/permissions.model';
import { Legal } from './legal.model';
import { PaddleEvent } from 'src/paddle-event/models/paddle-event.model';
import { PaddleEventEditor } from 'src/paddle-event/models/paddle-event-editor.model';
//import { IUser } from 'hkn-common';

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

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @HasMany(() => UserPermission)
  permissions: UserPermission[];

  @HasMany(() => PaddleEvent, 'creatorId')
  createdEvents: PaddleEvent[];

  @BelongsToMany(() => PaddleEvent, () => PaddleEventEditor)
  eventEditor: PaddleEvent[];

  @HasOne(() => Address)
  address: Address;

  @HasOne(() => Legal)
  legal: Legal;

  @HasMany(() => PhoneNumber)
  phoneNumbers: PhoneNumber[];
}
