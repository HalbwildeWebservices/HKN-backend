import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserPermission } from './models/user.model';
import { hash } from 'bcrypt'
import { PatchUserDto } from './dto/patch-user.dto';
import { Address } from './models/address.model';
import { PhoneNumber } from './models/phoneNumber.model';
import { EPermission } from 'hkn-common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Address)
    private readonly addressModel: typeof Address,
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
    return this.userModel.findAll({include: [UserPermission]});
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      include: [UserPermission],
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

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  async updateUser(id: string, patchUserDto: PatchUserDto): Promise<{user: number[], address: number[]}> {
    return this.userModel.update(patchUserDto, {
      where: {
        userId: id,
      }
    })
    .then((userRes) => {
      if (patchUserDto.address) {
        return this.addressModel.update(patchUserDto.address, {
          where: {
            userId: id,
          }
        }).then((addressRes) => {
          return Promise.resolve({user: userRes, address: addressRes})
        })
      } else {
        return Promise.resolve({user: userRes, address: []});
      }
    })    
  }
}
