import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from "../db_connection";

export class Role extends Model {
  id!: number;
  roleName!: string;
}

Role.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'Roles',
  timestamps: true,
});
