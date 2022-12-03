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

    /**
     * Delete all permissions for user identified by userId
     * @returns the number of deleted permissions
     */
    removePermissionsByUser(userId: string) {
        return this.permissionModel.destroy({
            where: {
                userId
            }
        })
    }

    /**
     * Get single permission identified by permissionId
     */
    removePermissionById(permissionId: string | string[]) {
        return this.permissionModel.destroy({
            where: {
                permissionId
            }
        })
    }

    /**
     * Get permissions for user identified by userId
     */
    getPermissionsByUser(userId: string) {
        return this.permissionModel.findAll({
            where: {
                userId
            }
        })
    }

    /**
     * Get single permission identified by permissionId
     */
    getPermissionsById(permissionId: string) {
        return this.permissionModel.findOne({
            where: {
                permissionId
            }
        })
    }

    /**
     * Set permissions for user
     * @param userId the userId of the user to set permissions for
     * @param setPermissionsDto The permissions to set
     * @returns the user's permissions after the operation
     */
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
