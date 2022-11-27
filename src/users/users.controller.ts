import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { CreatePhoneDto, PatchPhoneDto } from '../phoneNumbers/dto/phone.dto';
import { UsersService } from './users.service';
import { PhoneNumberService } from 'src/phoneNumbers/phone-number.service';
import { SetPermissionsDto } from 'src/permissions/dto/permissions.dto';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UserResponseDto } from './dto/user-response.dto';
import { PermissionResponseDto } from 'src/permissions/dto/permissions.dto';
import { IPermissionResponse } from 'hkn-common';
import { PoliciesGuard } from 'src/policies/policies.guard';
import { CheckPolicies } from 'src/policies/check-policies.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/actions';

@ApiBearerAuth()
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService, 
    private readonly phoneNumberService: PhoneNumberService,
    private readonly permissionsService: PermissionsService,
    ) {}

  @Post()
  //@UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService
      .create(createUserDto)
      .then((user) => {return new UserResponseDto(user)})
      .catch((err) => {console.error(err); return err.errors.map((e) => e.message).join(", ")});
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'list of all users',
    type: UserResponseDto,
    isArray: true,
  })
  @UseGuards(
    JwtAuthGuard,
    PoliciesGuard,
  )
  @CheckPolicies((ability: AppAbility) => ability.can(Action.READ, UserResponseDto))
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll()
      .then((users) => {
        const responseList = users.map((u) => new UserResponseDto(u))
        return responseList });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  findOne(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
    return this.usersService.findOne(userId)
      .then((user) => {return new UserResponseDto(user)});
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/permissions')
  getPermissions(@Param('userId', ParseUUIDPipe) userId: string): Promise<IPermissionResponse> {
    return this.usersService.findOne(userId)
      .then((user) => {
        return {permissions: user.permissions.map((p) => {return new PermissionResponseDto(p)})}
      });
  }

  //@UseGuards(JwtAuthGuard)
  @Patch(':userId')
  updateUser(@Param('userId', ParseUUIDPipe) userId: string, @Body() patchUserDto: PatchUserDto): Promise<UserResponseDto> {
    return this.usersService.updateUser(userId, patchUserDto)
      .then((user) => {return new UserResponseDto(user)});
  }

  @Patch(':userId/phone-numbers/:phoneId')
  updatePhoneNumber(@Param('userId', ParseUUIDPipe) userId: string, @Param('phoneId', ParseUUIDPipe) phoneId: string, @Body() patchPhoneNumber: PatchPhoneDto): Promise<UserResponseDto> {
    return this.phoneNumberService.updatePhoneNumber(phoneId, patchPhoneNumber)
      .then(() => {return this.usersService.findOne(userId)})
      .then((user) => {return new UserResponseDto(user)});
  }

  @Post(':userId/phone-numbers/')
  addPhoneNumber(@Param('userId', ParseUUIDPipe) userId: string,  @Body() createPhoneDto: CreatePhoneDto): Promise<UserResponseDto> {
    return this.phoneNumberService.addPhoneNumber(userId, createPhoneDto)
      .then(() => {return this.usersService.findOne(userId)})
      .then((user) => {return new UserResponseDto(user)});
  }


  @Put(':userId/permissions') 
  setPermissions(@Param('userId', ParseUUIDPipe) userId: string, @Body() setPermissionsDto: SetPermissionsDto): Promise<UserResponseDto> {
    const uniquePermissions = [...new Set(setPermissionsDto.permissions)];  
    return this.permissionsService.setPermissions(userId, {permissions: uniquePermissions})
        .then(() => {return this.usersService.findOne(userId)})
        .then((user) => {return new UserResponseDto(user)});
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  remove(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseDto[]> {
    return this.usersService
      .removeUser(userId)
      .then(() => {
        return this.usersService.findAll();
      })
      .then((users) => {
        const responseList = users.map((u) => new UserResponseDto(u))
        return responseList });
  }

  @Delete(':userId/permissions') 
  deletePermissions(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
      return this.permissionsService.removePermissionsByUser(userId)
        .then(() => {return this.usersService.findOne(userId)})
        .then((user) => {return new UserResponseDto(user)});
  }

  @Delete(':userId/phone-numbers') 
  deletePhoneNumbers(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
    return this.phoneNumberService.deletePhoneNumbersByUser(userId)
      .then(() => {return this.usersService.findOne(userId)})
      .then((user) => {return new UserResponseDto(user)})

  }

  @Delete(':userId/phone-numbers/:phoneId')
  deletePhoneNumber(@Param('userId', ParseUUIDPipe) userId: string, @Param('phoneId', ParseUUIDPipe) phoneId: string): Promise<UserResponseDto> {
    return this.phoneNumberService.deletePhoneNumbersById(phoneId)
      .then(() => {return this.usersService.findOne(userId)})
      .then((user) => {return new UserResponseDto(user)})
  }


}
