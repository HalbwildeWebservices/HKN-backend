import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { CreatePhoneDto, PatchPhoneDto } from '../phoneNumbers/dto/phone.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { PhoneNumberService } from 'src/phoneNumbers/phone-number.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly phoneNumberService: PhoneNumberService) {}

  @Post()
  //@UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService
      .create(createUserDto)
      .catch((err) => {console.error(err); return err.errors.map((e) => e.message).join(", ")});
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'list of all users',
    type: User,
    isArray: true,
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  findOne(@Param('userId') userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  //@UseGuards(JwtAuthGuard)
  @Patch(':userId')
  updateUser(@Param('userId') userId: string, @Body() patchUserDto: PatchUserDto): Promise<User> {
    return this.usersService.updateUser(userId, patchUserDto);
  }

  @Patch(':userId/phone-numbers/:phoneId')
  updatePhoneNumber(@Param('userId') userId: string, @Param('phoneId') phoneId: string, @Body() patchPhoneNumber: PatchPhoneDto): Promise<User> {
    return this.phoneNumberService.updatePhoneNumber(phoneId, patchPhoneNumber)
      .then(() => {return this.usersService.findOne(userId)})
  }

  @Delete(':userId/phone-numbers/:phoneId')
  deletePhoneNumber(@Param('userId') userId: string, @Param('phoneId') phoneId: string): Promise<User> {
    return this.phoneNumberService.deletePhoneNumbers(phoneId)
      .then(() => {return this.usersService.findOne(userId)})
  }

  @Post(':userId/phone-numbers/')
  addPhoneNumber(@Param('userId') userId: string,  @Body() createPhoneDto: CreatePhoneDto): Promise<User> {
    return this.phoneNumberService.addPhoneNumber(userId, createPhoneDto)
      .then(() => {return this.usersService.findOne(userId)})
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<User[]> {
    return this.usersService
      .removeUser(id)
      .then(() => {
        return this.usersService.findAll();
      })
  }
}
