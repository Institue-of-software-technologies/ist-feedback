import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { Role } from './Role';
import { Permission } from './Permission';

export class RolePermission extends Model {
  roleId!: number;
  permissionId!: number;

  // This tells TypeScript that RolePermission has a 'permission' field when associated
  permission?: Permission;
}

RolePermission.init({
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  permissionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Permission,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'RolePermission',
  tableName: 'Role_Permissions',
  timestamps: false,
});

// Define associations between RolePermission and Permission, Role
RolePermission.belongsTo(Permission, { foreignKey: 'permissionId', as: 'permission' });
RolePermission.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });