import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from "../db_connection";

export class Permission extends Model {
  id!: number;
  permissionName!: string;
}

Permission.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  permissionName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Permission',
  tableName: 'Permissions',
  timestamps: true,
});
