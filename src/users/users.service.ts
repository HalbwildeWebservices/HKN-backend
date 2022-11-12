import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserPermission } from './models/user.model';
import { hash } from 'bcrypt'
import { PatchUserDto } from './dto/patch-user.dto';
import { Address } from './models/address.model';
import { PhoneNumber } from './models/phoneNumber.model';
import { EPermission } from 'hkn-common';
import { PatchPhoneDto } from './dto/phone.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Address)
    private readonly addressModel: typeof Address,
    @InjectModel(PhoneNumber)
    private readonly phoneNumberModel: typeof PhoneNumber,
    @InjectModel(UserPermission)
    private readonly permissionModel: typeof UserPermission,
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
      await this.phoneNumberModel.destroy({
        where: {
          userId: id
        }
      }).then((destroyedPhoneNumbers) => this.logger.log(`destroyed ${destroyedPhoneNumbers} phone numbers for user ${id}`));
    }
    if (user.permissions) {
      this.permissionModel.destroy({
        where: {
          userId: id
        }
      }).then((destroyedPermissions) => this.logger.log(`destroyed ${destroyedPermissions} permissions for user ${id}`));
    }
    await user.destroy().then(() => this.logger.log(`destroyed user ${id}`));
  }

  async updateUser(id: string, patchUserDto: PatchUserDto): Promise<User> {
    let currentUser: User;
    try {
      currentUser = await this.findOne(id);
    } catch (err) {
      return Promise.reject(err);
    }
    let addressPromise: Promise<number[]> = Promise.resolve([]);
    if (patchUserDto.address && currentUser.address) {
      addressPromise = this.updateAddress(id, patchUserDto.address)
    } else if (patchUserDto.address && !currentUser.address) {
      addressPromise = this.addAddress(id, patchUserDto.address)
        .then(() => {return [1]})
    }
    const phonePromise: Promise<PhoneNumber[]> = patchUserDto.phoneNumbers?.length 
      ? this.updateOrAddPhoneNumbers(id, patchUserDto.phoneNumbers)
      : Promise.resolve([])
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
        this.logger.log(`address updated ${res}`); 
        return phonePromise;
      })
      .catch((err) => {
        this.logger.error(err.message ?? 'general phone update error');
        return [];
      })
      .then((res) => {
        this.logger.log(`phone updated ${res.length}`); 
        return this.findOne(id)
      });
    return chainedPromise;
  }

  async updateOrAddPhoneNumbers(userId: string, patchPhoneNumberDto: PatchPhoneDto[]) {
    const updateObj = patchPhoneNumberDto.map((p) => {return {userId, ...p, phoneId: p.phoneId?.length > 0 ? p.phoneId : randomUUID()}})
    this.logger.log(`phoneIds: ${updateObj.map((o) => o.phoneId).join(', ')}`)
    return this.phoneNumberModel.bulkCreate(updateObj, 
      {
        updateOnDuplicate: ['number', 'description']
      })
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
