import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";

export class Token extends Model {
  id!: number;
  token!: string;
  expiresAt!: Date;
}

Token.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  tokenValue: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  sequelize,
  modelName: 'Tokens',
  tableName: 'Tokens',
  timestamps: true,
});