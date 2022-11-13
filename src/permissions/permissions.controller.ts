import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SetPermissionsDto } from './dto/permissions.dto';
import { PermissionsService } from './permissions.service';

@ApiBearerAuth()
@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {

    constructor(private readonly permissionsService: PermissionsService) {}

    @Get(':userId')
    getPermissions(@Param('userId') userId: string) {
        return this.permissionsService.getPermissions(userId)
    }

    @Put(':userId') 
    setPermissions(@Param('userId') userId: string, @Body() setPermissionsDto: SetPermissionsDto) {
        return this.permissionsService.setPermissions(userId, setPermissionsDto);
    }

}
