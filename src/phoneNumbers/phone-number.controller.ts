import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Action } from "src/casl/actions";
import { AppAbility } from "src/casl/casl-ability.factory";
import { CheckPolicies } from "src/policies/check-policies.decorator";
import { PoliciesGuard } from "src/policies/policies.guard";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { PatchPhoneDto } from "./dto/phone.dto";
import { PhoneNumber } from "./models/phoneNumber.model";
import { PhoneNumberService } from "./phone-number.service";

@ApiBearerAuth()
@ApiTags('phone-numbers')
@UseGuards(JwtAuthGuard)
@Controller('phone-numbers')
export class PhoneNumberController {

    constructor(private readonly phoneNumberService: PhoneNumberService) {}

    //TODO: allow self
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.UPDATE, UserResponseDto))
    @Patch(':phoneId')
    updatePhoneNumber(@Param('phoneId', ParseUUIDPipe) phoneId: string, @Body() patchPhoneNumber: PatchPhoneDto): Promise<PhoneNumber> {
      return this.phoneNumberService.updatePhoneNumber(phoneId, patchPhoneNumber)
    }
    
    //TODO: allow self
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.DELETE, UserResponseDto))
    @Delete(':phoneId')
    deletePhoneNumber(@Param('phoneId', ParseUUIDPipe) phoneId: string): Promise<number> {
      return this.phoneNumberService.deletePhoneNumbersById(phoneId)
    }

    //TODO: allow self
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.READ, UserResponseDto))
    @Get(':phoneId')
    getPhoneNumber(@Param('phoneId', ParseUUIDPipe) phoneId: string): Promise<PhoneNumber> {
        return this.phoneNumberService.findPhoneNumber(phoneId);
    }

}