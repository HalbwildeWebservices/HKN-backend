import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PatchPhoneDto } from "./dto/phone.dto";
import { PhoneNumber } from "./models/phoneNumber.model";
import { PhoneNumberService } from "./phone-number.service";

@ApiBearerAuth()
@ApiTags('phone-numbers')
@Controller('phone-numbers')
export class PhoneNumberController {

    constructor(private readonly phoneNumberService: PhoneNumberService) {}

    @Patch(':phoneId')
    updatePhoneNumber(@Param('phoneId') phoneId: string, @Body() patchPhoneNumber: PatchPhoneDto): Promise<PhoneNumber> {
      return this.phoneNumberService.updatePhoneNumber(phoneId, patchPhoneNumber)
    }
  
    @Delete(':phoneId')
    deletePhoneNumber(@Param('phoneId') phoneId: string): Promise<number> {
      return this.phoneNumberService.deletePhoneNumbersById(phoneId)
    }

    @Get(':phoneId')
    getPhoneNumber(@Param('phoneId') phoneId: string): Promise<PhoneNumber> {
        return this.phoneNumberService.findPhoneNumber(phoneId);
    }

}