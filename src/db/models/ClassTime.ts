import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";

export class ClassTime extends Model {
  id!: number;
  classTime!: string ;
}

ClassTime.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  classTime: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'ClassTime',
  tableName: 'ClassTimes',
  timestamps: true,
});
