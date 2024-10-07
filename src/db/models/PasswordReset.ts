import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from "../db_connection";

export class PasswordReset extends Model {
  id!: number;
  permissionName!: string;
}

PasswordReset.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'PasswordReset',
  tableName: 'PasswordReset',
  timestamps: true,
});