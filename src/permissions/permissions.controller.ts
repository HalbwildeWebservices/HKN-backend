import { Controller, Get, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Action } from 'src/casl/actions';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/policies/check-policies.decorator';
import { PermissionsPolicy } from 'src/policies/policies.classes';
import { PoliciesGuard } from 'src/policies/policies.guard';
import { PermissionResponseDto } from './dto/permissions.dto';
import { UserPermission } from './models/permissions.model';
import { PermissionsService } from './permissions.service';

@ApiBearerAuth()
@ApiTags('permissions')
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('permissions')
export class PermissionsController {

    constructor(private readonly permissionsService: PermissionsService) {}

    /**
     * get given permission. Allowed if user has read right and for own permissions.
     * @param permissionId id of permission to read
     * @returns permission response
     */
    @CheckPolicies(new PermissionsPolicy(Action.READ))
    @Get(':permissionId')
    getPermissions(@Param('permissionId', ParseUUIDPipe) permissionId: string) {
        return this.permissionsService
            .getPermissionsById(permissionId)
            .then((p) => {
                return new PermissionResponseDto(p);
            })
    }

    /**
     * delete given permission. Only allowed if user has the specific permission
     * @param permissionId the id of the permission to be deleted
     * @returns number of deleted permissions 
     */
    @CheckPolicies((ability: AppAbility) => ability.can(Action.DELETE, UserPermission))
    @Delete(':permissionId')
    deletePermission(@Param('permissionId', ParseUUIDPipe) permissionId: string) {
        return this.permissionsService.removePermissionById(permissionId);
    }

}
