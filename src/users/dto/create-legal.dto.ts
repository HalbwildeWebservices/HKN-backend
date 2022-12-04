import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, Equals} from "class-validator";
import { IAcceptLegal } from "hkn-common/dist/src/legal";


export class CreateLegalDto implements IAcceptLegal {
    @ApiProperty({example: true, description: "accept the privacy declaration"})
    @IsBoolean()
    @Equals(true)
    acceptPrivacy: boolean;
    @ApiProperty({example: true, description: "accept terms of use"})
    @IsBoolean()
    @Equals(true)
    acceptTerms: boolean;
}