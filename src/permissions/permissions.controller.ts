import { Controller, Get, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Action } from 'src/casl/actions';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/policies/check-policies.decorator';
import { PoliciesGuard } from 'src/policies/policies.guard';
import { UserPermission } from './models/permissions.model';
import { PermissionsService } from './permissions.service';

@ApiBearerAuth()
@ApiTags('permissions')
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {

    constructor(private readonly permissionsService: PermissionsService) {}

    //TODO: can allow this if permission.userId matches with caller's userId
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.MANAGE, UserPermission))
    @Get(':permissionId')
    getPermissions(@Param('permissionId', ParseUUIDPipe) permissionId: string) {
        return this.permissionsService.getPermissionsById(permissionId)
    }

    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.MANAGE, UserPermission))
    @Delete(':permissionId')
    deletePermission(@Param('permissionId', ParseUUIDPipe) permissionId: string) {
        return this.permissionsService.removePermissionById(permissionId);
    }

}
