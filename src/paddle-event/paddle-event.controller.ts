import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { PatchEventDto } from './dto/patch-event.dto';
import { PaddleEventService } from './paddle-event.service';

@ApiTags('events')
@Controller('events')
export class PaddleEventController {
  constructor(private readonly eventService: PaddleEventService) {}

  @Get()
  getAllEvents() {
    return this.eventService.getAllEvents().then((events) => {
      return events.map((e) => new EventResponseDto(e));
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':eventId')
  getEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.eventService.getEvent(eventId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId/created-by')
  getCreatedEvents(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.eventService.getEventsByUser(userId, 'creator');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId/editor-of')
  getEditableEvents(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.eventService.getEventsByUser(userId, 'editor');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  createPaddleEvent(@Body() createEventDto: CreateEventDto, @Request() request: any)  {
    return this.eventService.createEvent(createEventDto, request?.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':eventId')
  updatePaddleEvent(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Body() patchEventDto: PatchEventDto
  ) {
    return this.eventService.updateEvent(eventId, patchEventDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':eventId')
  deletePaddleEvent(@Param() eventId: string) {
    return this.eventService.deleteEvent(eventId);
  }
}
