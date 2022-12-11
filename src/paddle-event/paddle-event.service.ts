import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/models/user.model';
import { CreateEventDto } from './dto/create-event.dto';
import { PatchEventDto } from './dto/patch-event.dto';
import { PaddleEventEditor } from './models/paddle-event-editor.model';
import { PaddleEvent } from './models/paddle-event.model';


@Injectable()
export class PaddleEventService {

  constructor(
    @InjectModel(PaddleEvent)
    private readonly paddleEventModel: typeof PaddleEvent,
    @InjectModel(PaddleEventEditor)
    private readonly paddleEventEditorModel: typeof PaddleEventEditor,
    @InjectModel(User)
    private readonly userModel: typeof User,

  ) {  }

  getAllEvents(): Promise<PaddleEvent[]> {
    return this.paddleEventModel.findAll({
      include: [PaddleEventEditor]
    });
  }

  getEvent(eventId: string): Promise<PaddleEvent> {
    return this.paddleEventModel.findOne({
      where: {
        eventId
      },
      include: [PaddleEventEditor]
    })
  }

  getEventsByUser(userId: string, mode: 'editor' | 'creator'): Promise<PaddleEvent[]> {
    if (mode === 'creator') {
      //find all events where user is creator
      return this.paddleEventModel.findAll({where: {
        creatorId: userId
      }})
    } else if (mode === 'editor') {
      //find all events where user is editor
      this.paddleEventEditorModel
        .findAll({where: {userId}})
        .then((editors) => {return editors.map((e) => e.eventId)})
        .then((eventIds) => {
          return this.paddleEventModel.findAll({
            where: {
              eventId: eventIds
            },
            include: [PaddleEventEditor]
          })
        })
    } else {
      //for future usage
      return Promise.resolve([])
    }
    
  }

  async createEvent(createEventDto: CreateEventDto, creator: User): Promise<PaddleEvent> {
    if (creator === undefined) {
      throw new UnauthorizedException('only logged-in users can create new events');
    }
    let editors: User[] = [];
    const isPublic = createEventDto.public ? true : false;
    const {editorIds, ...eventToCreate} = {
      editors, 
      creatorId: creator.userId, 
      public: isPublic,
      ...createEventDto
    };

    if (editorIds.length === 0 || !editorIds.includes(creator.userId)) {
      editorIds.push(creator.userId);
    }
    editors = await this.userModel.findAll({
       where: {
         userId: editorIds
       }
    })
    eventToCreate.editors = editors;
    
    return this.paddleEventModel.create({...eventToCreate})
  }

  deleteEvent(eventId: string) {
    console.log(`deleteEvent for eventId=${eventId}`)
  }

  updateEvent(eventId: string, patchEventDto: PatchEventDto) {
    console.log(`updateEvent for eventId=${eventId}, toPatch=${JSON.stringify(patchEventDto)}`)
  }

}
