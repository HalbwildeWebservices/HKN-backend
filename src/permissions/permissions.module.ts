import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserPermission } from './models/permissions.model';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [SequelizeModule.forFeature([UserPermission]), CaslModule],
  providers: [PermissionsService],
  exports: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
