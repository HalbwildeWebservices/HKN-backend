import { Test, TestingModule } from '@nestjs/testing';
import { PhoneNumberService } from './phone-number.service';

describe('PhoneNumberServiceService', () => {
  let service: PhoneNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneNumberService],
    }).compile();

    service = module.get<PhoneNumberService>(PhoneNumberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
