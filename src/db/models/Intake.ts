import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";

export class Intake extends Model {
  id!: number;
  intakeName!: string;
  intakeYear!: string;
}

Intake.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  intakeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  intakeYear: {
    type: DataTypes.STRING,
    allowNull:false,
  },
}, {
  sequelize,
  modelName: 'Intake',
  tableName: 'Intakes',
  timestamps: true,
});
