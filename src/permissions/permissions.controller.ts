import { Controller, Get, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';

@ApiBearerAuth()
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {

    constructor(private readonly permissionsService: PermissionsService) {}

    @Get(':permissionId')
    getPermissions(@Param('permissionId', ParseUUIDPipe) permissionId: string) {
        return this.permissionsService.getPermissionsById(permissionId)
    }

    @Delete(':permissionId')
    deletePermission(@Param('permissionId', ParseUUIDPipe) permissionId: string) {
        return this.permissionsService.removePermissionById(permissionId);
    }

}
