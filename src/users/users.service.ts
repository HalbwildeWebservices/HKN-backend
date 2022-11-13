import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { hash } from 'bcrypt'
import { PatchUserDto } from './dto/patch-user.dto';
import { Address } from './models/address.model';
import { PhoneNumber } from '../phoneNumbers/models/phoneNumber.model';
import { EPermission } from 'hkn-common';
import { CreateAddressDto } from './dto/create-address.dto';
import { PhoneNumberService } from 'src/phoneNumbers/phone-number.service';
import { UserPermission } from 'src/permissions/models/permissions.model';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Address)
    private readonly addressModel: typeof Address,
    private readonly permissionsService: PermissionsService,
    private readonly phoneNumberService: PhoneNumberService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await hash(createUserDto.password, 10);
    return this.userModel.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      password,
      username: createUserDto.username,
      email: createUserDto.email,
      permissions: [{name: EPermission.DEFAULT}],
      address: createUserDto.address,
      phoneNumbers: createUserDto.phoneNumbers ?? [],
    }, {include: [UserPermission, Address, PhoneNumber]});
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({include: [UserPermission, Address, PhoneNumber]});
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      include: [UserPermission, Address, PhoneNumber],
      where: {
        userId: id,
      },
    });
  }

  findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (user.address) {
      await this.addressModel.destroy({
        where: {
          userId: id
        }
      }).then((destroyedAddresses) => this.logger.log(`destroyed ${destroyedAddresses} addresses for user ${id}`));
    }
    if (user.phoneNumbers) {
      this.phoneNumberService.deletePhoneNumbers(user.phoneNumbers.map((p) => p.phoneId))
      .then((destroyedPhoneNumbers) => this.logger.log(`destroyed ${destroyedPhoneNumbers} phone numbers for user ${id}`));
    }
    if (user.permissions) {
      this.permissionsService.removePermissions(user.userId)
      .then((destroyedPermissions) => this.logger.log(`destroyed ${destroyedPermissions} permissions for user ${id}`));
    }
    await user.destroy().then(() => this.logger.log(`destroyed user ${id}`));
  }

  async updateUser(id: string, patchUserDto: PatchUserDto): Promise<User> {
    const addressPromise: Promise<number[]> = patchUserDto.address 
      ? this.updateAddress(id, patchUserDto.address)
      : Promise.resolve([]);
    const userPromise = this.userModel.update(patchUserDto, {
      where: {
        userId: id,
      }
    })
    
    const chainedPromise = userPromise
      .catch((err) => {
        this.logger.error(err.message ?? 'general user update error')
        return [];
      })
      .then((res) => {
        this.logger.log(`user updated ${res}`); 
        return addressPromise;
      })
      .catch((err) => {
        this.logger.error(err.message ?? 'general address update error')
        return [];
      })
      .then((res) => {
        this.logger.log(`address updated ${res.length}`); 
        return this.findOne(id)
      });
    return chainedPromise;
  }

  async updateAddress(userId: string, address: CreateAddressDto) {
    return this.addressModel.update(address, {
      where: {
        userId
      }
    })
  }

  async addAddress(userId: string, address: CreateAddressDto) {
    const addressToSet = {...address, userId };
    return this.addressModel.create(addressToSet)
  }
}
