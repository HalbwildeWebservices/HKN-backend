import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './models/address.model';
import { User } from './models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PhoneNumberModule } from 'src/phoneNumbers/phone-number.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { CaslModule } from 'src/casl/casl.module';
import { Legal } from './models/legal.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Address, Legal]),
    PhoneNumberModule,
    PermissionsModule,
    CaslModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
