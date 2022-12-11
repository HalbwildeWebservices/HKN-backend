import { Test, TestingModule } from '@nestjs/testing';
import { PaddleEventController } from './paddle-event.controller';

describe('EventController', () => {
  let controller: PaddleEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaddleEventController],
    }).compile();

    controller = module.get<PaddleEventController>(PaddleEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
