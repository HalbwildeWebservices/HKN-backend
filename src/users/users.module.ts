import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './models/address.model';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PhoneNumberModule } from 'src/phoneNumbers/phone-number.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Address]),
    PhoneNumberModule,
    PermissionsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
