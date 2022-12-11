import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Action } from "src/casl/actions";
import { CheckPolicies } from "src/policies/check-policies.decorator";
import { PhoneNumbersPolicy } from "src/policies/policies.classes";
import { PoliciesGuard } from "src/policies/policies.guard";
import { PatchPhoneDto, PhoneResponseDto } from "./dto/phone.dto";
import { PhoneNumberService } from "./phone-number.service";

@ApiBearerAuth()
@ApiTags('phone-numbers')
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('phone-numbers')
export class PhoneNumberController {

    constructor(private readonly phoneNumberService: PhoneNumberService) {}

    /**
     * update a given phone number. Allowed if user has update permissions and for own numbers
     * @returns updated phone number
     */
    @CheckPolicies(new PhoneNumbersPolicy(Action.UPDATE))
    @Patch(':phoneId')
    updatePhoneNumber(@Param('phoneId', ParseUUIDPipe) phoneId: string, @Body() patchPhoneNumber: PatchPhoneDto): Promise<PhoneResponseDto> {
      return this.phoneNumberService
        .updatePhoneNumber(phoneId, patchPhoneNumber)
        .then((p) => {return new PhoneResponseDto(p)})
    }
    
    /**
     * delete a given phone number. Allowed if user has delete permissions and for own numbers
     * @returns number of deleted phone numbers
     */
    @CheckPolicies(new PhoneNumbersPolicy(Action.DELETE))
    @Delete(':phoneId')
    deletePhoneNumber(@Param('phoneId', ParseUUIDPipe) phoneId: string): Promise<number> {
      return this.phoneNumberService.deletePhoneNumbersById(phoneId)
    }


    /**
     * get a given phone number. Allowed if user has read permissions and for own numbers
     * @returns the phone number
     */
    @CheckPolicies(new PhoneNumbersPolicy(Action.READ))
    @Get(':phoneId')
    getPhoneNumber(@Param('phoneId', ParseUUIDPipe) phoneId: string): Promise<PhoneResponseDto> {
        return this.phoneNumberService
          .findPhoneNumber(phoneId)
          .then((p) => {return new PhoneResponseDto(p)})
    }

}