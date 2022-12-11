import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/models/user.model';
import { PaddleEventEditor } from './models/paddle-event-editor.model';
import { PaddleEvent } from './models/paddle-event.model';
import { PaddleEventController } from './paddle-event.controller';
import { PaddleEventService } from './paddle-event.service';

@Module({
  imports: [SequelizeModule.forFeature([PaddleEvent, PaddleEventEditor, User])],
  controllers: [PaddleEventController],
  providers: [PaddleEventService],
  exports: [PaddleEventService],
})
export class EventsModule {}
