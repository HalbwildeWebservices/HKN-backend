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
import { UserPermission } from 'src/permissions/models/permissions.model';
import { User } from './models/user.model';
import { PermissionsPolicy, PhoneNumbersPolicy } from 'src/policies/policies.classes';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService, 
    private readonly phoneNumberService: PhoneNumberService,
    private readonly permissionsService: PermissionsService,
    ) {}

  /**
   * Create a new user
   * @returns the new user
   */
  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.CREATE, User))
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService
      .create(createUserDto)
      .then((user) => {return new UserResponseDto(user)})
      .catch((err) => {console.error(err); return err.errors.map((e) => e.message).join(", ")});
  }

  /**
   * Get all users. 
   * Allowed with list user permission
   * @returns user response array
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'list of all users',
    type: UserResponseDto,
    isArray: true,
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.LIST, User))
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll()
      .then((users) => {
        const responseList = users.map((u) => new UserResponseDto(u))
        return responseList });
  }

  /**
   * Get a specific user. 
   * Allowed with user read permissions.
   * @returns user response
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.READ, User))
  @Get(':userId')
  findOne(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
    return this.usersService.findOne(userId)
      .then((user) => {return new UserResponseDto(user)});
  }

  /**
   * Get a user's permissions. 
   * Allowed with permission read permissions and for own permissions
   * @returns permission response
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PermissionsPolicy(Action.READ))
  @Get(':userId/permissions')
  getPermissions(@Param('userId', ParseUUIDPipe) userId: string): Promise<IPermissionResponse> {
    return this.usersService.findOne(userId)
      .then((user) => {
        return {permissions: user.permissions.map((p) => {return new PermissionResponseDto(p)})}
      });
  }

  /**
   * Update a user's properties. Allowed with user update permissions and for own properties
   * @returns the updated user
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.UPDATE, User))
  @Patch(':userId')
  updateUser(@Param('userId', ParseUUIDPipe) userId: string, @Body() patchUserDto: PatchUserDto): Promise<UserResponseDto> {
    return this.usersService.updateUser(userId, patchUserDto)
      .then((user) => {return new UserResponseDto(user)});
  }

  /**
   * update a given phone number for a given user. 
   * Allowed with phone number update permissions and for own phone numbers
   * @returns the user after the update
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PhoneNumbersPolicy(Action.UPDATE))
  @Patch(':userId/phone-numbers/:phoneId')
  updatePhoneNumber(@Param('userId', ParseUUIDPipe) userId: string, @Param('phoneId', ParseUUIDPipe) phoneId: string, @Body() patchPhoneNumber: PatchPhoneDto): Promise<UserResponseDto> {
    //TODO: don't blindly update any phone number, only if really belongs to user with given id
    return this.phoneNumberService.updatePhoneNumber(phoneId, patchPhoneNumber)
      .then(() => {return this.usersService.findOne(userId)})
      .then((user) => {return new UserResponseDto(user)});
  }

  /**
   * add phone numbers for a given user. 
   * Allowed with user update permissions and for own phone numbers.
   * @returns the user after the update
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.UPDATE, User))
  @Post(':userId/phone-numbers/')
  addPhoneNumber(@Param('userId', ParseUUIDPipe) userId: string,  @Body() createPhoneDto: CreatePhoneDto): Promise<UserResponseDto> {
    return this.phoneNumberService.addPhoneNumber(userId, createPhoneDto)
      .then(() => {return this.usersService.findOne(userId)})
      .then((user) => {return new UserResponseDto(user)});
  }

  /**
   * Set user permissions. Only allowed with permission create and delete permissions.
   * @returns the user after the update
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.CREATE, UserPermission) && ability.can(Action.DELETE, UserPermission))
  @Put(':userId/permissions') 
  setPermissions(@Param('userId', ParseUUIDPipe) userId: string, @Body() setPermissionsDto: SetPermissionsDto): Promise<UserResponseDto> {
    const uniquePermissions = [...new Set(setPermissionsDto.permissions)];  
    return this.permissionsService.setPermissions(userId, {permissions: uniquePermissions})
        .then(() => {return this.usersService.findOne(userId)})
        .then((user) => {return new UserResponseDto(user)});
  }


  /**
   * Delete a given user completely. 
   * Allowed with user delete permissions and for the users themselves.
   * @returns List of remaining users TODO: re-think. Just respond with a boolean maybe?
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.DELETE, User))
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

  /**
   * Delete all permissions from given user. 
   * Allowed only with permission manage permissions.
   * @returns the user after the deletion
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.DELETE, UserPermission))
  @Delete(':userId/permissions') 
  deletePermissions(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
      return this.permissionsService.removePermissionsByUser(userId)
        .then(() => {return this.usersService.findOne(userId)})
        .then((user) => {return new UserResponseDto(user)});
  }

  /**
   * Delete all phone numbers from a given user. 
   * Allowed with phone number delete permissions and for own phone numbers
   * @returns the user after the deletion
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PhoneNumbersPolicy(Action.DELETE))
  @Delete(':userId/phone-numbers') 
  deletePhoneNumbers(@Param('userId', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
    return this.phoneNumberService.deletePhoneNumbersByUser(userId)
      .then(() => {return this.usersService.findOne(userId)})
      .then((user) => {return new UserResponseDto(user)})

  }

  /**
   * Delete specific phone number from specific user. 
   * Allowed with phone number delete permissions and for own phone numbers.
   * @returns the user after the deletion
   */
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PhoneNumbersPolicy(Action.DELETE))
  @Delete(':userId/phone-numbers/:phoneId')
  deletePhoneNumber(@Param('userId', ParseUUIDPipe) userId: string, @Param('phoneId', ParseUUIDPipe) phoneId: string): Promise<UserResponseDto> {
    //TODO: dont blindly delete any phone-number - only if really belongs to given user
    return this.phoneNumberService.deletePhoneNumbersById(phoneId)
      .then(() => {return this.usersService.findOne(userId)})
      .then((user) => {return new UserResponseDto(user)})
  }


}
