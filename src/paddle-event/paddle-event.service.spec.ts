import { Test, TestingModule } from '@nestjs/testing';
import { PaddleEventService } from './paddle-event.service';

describe('EventsService', () => {
  let service: PaddleEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaddleEventService],
    }).compile();

    service = module.get<PaddleEventService>(PaddleEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
