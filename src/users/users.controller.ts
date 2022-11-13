import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { CreatePhoneDto, PatchPhoneDto } from '../phoneNumbers/dto/phone.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { PhoneNumberService } from 'src/phoneNumbers/phone-number.service';
import { SetPermissionsDto } from 'src/permissions/dto/permissions.dto';
import { PermissionsService } from 'src/permissions/permissions.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService, 
    private readonly phoneNumberService: PhoneNumberService,
    private readonly permissionsService: PermissionsService,
    ) {}

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
  findOne(@Param('userId', ParseUUIDPipe) userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  //@UseGuards(JwtAuthGuard)
  @Patch(':userId')
  updateUser(@Param('userId', ParseUUIDPipe) userId: string, @Body() patchUserDto: PatchUserDto): Promise<User> {
    return this.usersService.updateUser(userId, patchUserDto);
  }

  @Patch(':userId/phone-numbers/:phoneId')
  updatePhoneNumber(@Param('userId', ParseUUIDPipe) userId: string, @Param('phoneId', ParseUUIDPipe) phoneId: string, @Body() patchPhoneNumber: PatchPhoneDto): Promise<User> {
    return this.phoneNumberService.updatePhoneNumber(phoneId, patchPhoneNumber)
      .then(() => {return this.usersService.findOne(userId)})
  }

  @Post(':userId/phone-numbers/')
  addPhoneNumber(@Param('userId', ParseUUIDPipe) userId: string,  @Body() createPhoneDto: CreatePhoneDto): Promise<User> {
    return this.phoneNumberService.addPhoneNumber(userId, createPhoneDto)
      .then(() => {return this.usersService.findOne(userId)})
  }


  @Put(':userId/permissions') 
  setPermissions(@Param('userId', ParseUUIDPipe) userId: string, @Body() setPermissionsDto: SetPermissionsDto) {
      return this.permissionsService.setPermissions(userId, setPermissionsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  remove(@Param('userId', ParseUUIDPipe) userId: string): Promise<User[]> {
    return this.usersService
      .removeUser(userId)
      .then(() => {
        return this.usersService.findAll();
      })
  }

  @Delete(':userId/permissions') 
  deletePermissions(@Param('userId', ParseUUIDPipe) userId: string) {
      return this.permissionsService.removePermissionsByUser(userId);
  }

  @Delete(':userId/phone-numbers') 
  deletePhoneNumbers(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.phoneNumberService.deletePhoneNumbersByUser(userId)
      .then(() => {return this.usersService.findOne(userId)})

  }

  @Delete(':userId/phone-numbers/:phoneId')
  deletePhoneNumber(@Param('userId', ParseUUIDPipe) userId: string, @Param('phoneId', ParseUUIDPipe) phoneId: string): Promise<User> {
    return this.phoneNumberService.deletePhoneNumbersById(phoneId)
      .then(() => {return this.usersService.findOne(userId)})
  }


}
