import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CaslModule } from 'src/casl/casl.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PhoneNumber } from '../phoneNumbers/models/phoneNumber.model';
import { PhoneNumberController } from './phone-number.controller';
import { PhoneNumberService } from './phone-number.service';

@Module({
  imports: [SequelizeModule.forFeature([PhoneNumber]), CaslModule, PermissionsModule],
  providers: [PhoneNumberService],
  controllers: [PhoneNumberController],
  exports: [PhoneNumberService],
})
export class PhoneNumberModule {}
