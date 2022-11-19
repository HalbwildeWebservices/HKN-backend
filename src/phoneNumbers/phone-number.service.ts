import { Injectable, Logger } from '@nestjs/common';
import { PhoneNumber } from './models/phoneNumber.model';
import { InjectModel } from '@nestjs/sequelize';
import { PatchPhoneDto, CreatePhoneDto } from './dto/phone.dto';

@Injectable()
export class PhoneNumberService {
    private readonly logger = new Logger('PhoneNumberService');
    constructor(
        @InjectModel(PhoneNumber)
        private readonly phoneNumberModel: typeof PhoneNumber) {}

    updatePhoneNumber(phoneId: string, patchPhoneDto: PatchPhoneDto) {
        return this.phoneNumberModel.update(patchPhoneDto, {
            where: {
                phoneId
            }
        })
        .then(() => { 
            this.logger.log(`updated phone number phoneId=${phoneId}`);
            return this.findPhoneNumber(phoneId) 
        });
    }

    deletePhoneNumbersById(phoneId: string | string[]) {
        return this.phoneNumberModel.destroy({
            where: {
                phoneId,
            }
        })
        .then((res) => { 
            const phoneIds = Array.isArray(phoneId) ? `[${phoneId.join(', ')}]` : phoneId;
            this.logger.log(`destroyed phone number(s) phoneId=${phoneIds}`);
            return res;
        });
    }

    deletePhoneNumbersByUser(userId: string) {
        return this.phoneNumberModel.destroy({
            where: {
                userId,
            }
        })
        .then((res) => { 
            this.logger.log(`destroyed ${res} phone number(s) for userId=${userId}`);
            return res;
        });
    }
    
    addPhoneNumber(userId: string, createPhoneDto: CreatePhoneDto) {
        const toCreate = {...createPhoneDto, userId}
        return this.phoneNumberModel
            .create(toCreate)
            .then((phoneNumber) => {
                this.logger.log(`created new phone number phoneId=${phoneNumber.phoneId}`)
            });
    }

    findPhoneNumber(phoneId: string) {
        return this.phoneNumberModel.findOne({
            where: {
                phoneId
            }
        })
    }

}
