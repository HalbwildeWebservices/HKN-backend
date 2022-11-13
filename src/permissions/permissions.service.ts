import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SetPermissionsDto } from './dto/permissions.dto';
import { UserPermission } from './models/permissions.model';

@Injectable()
export class PermissionsService {
    
    private readonly logger = new Logger('PermissionsService');
    constructor(
        
        @InjectModel(UserPermission)
        private readonly permissionModel: typeof UserPermission) {}

    removePermissionsByUser(userId: string) {
        return this.permissionModel.destroy({
            where: {
                userId
            }
        })
    }

    removePermissionById(permissionId: string | string[]) {
        return this.permissionModel.destroy({
            where: {
                permissionId
            }
        })
    }

    getPermissionsByUser(userId: string) {
        return this.permissionModel.findAll({
            where: {
                userId
            }
        })
    }

    getPermissionsById(permissionId: string) {
        return this.permissionModel.findOne({
            where: {
                permissionId
            }
        })
    }

    async setPermissions(userId: string, setPermissionsDto: SetPermissionsDto) {
        const currentPermissions = await this.getPermissionsByUser(userId);
        const currentPermissionNames = currentPermissions.map((p) => p.name);
        const permissionsToAdd = setPermissionsDto.permissions.filter((p) => !currentPermissionNames.includes(p)).map((name) => {return {name, userId}});
        const permissionNamesToDelete = currentPermissionNames.filter((p) => !setPermissionsDto.permissions.includes(p));
        return this.permissionModel.destroy({
            where: {
                userId,
                name: permissionNamesToDelete,
            }
        }).then((numberDeleted) => {
            this.logger.log(`deleted n=${numberDeleted} permissions from userId=${userId}`);
            return this.permissionModel.bulkCreate(permissionsToAdd);
        }).then(() => {
            this.logger.log(`added n=${permissionsToAdd.length} permissions for userId=${userId}`)
            return this.getPermissionsByUser(userId);
        })
    }
}
