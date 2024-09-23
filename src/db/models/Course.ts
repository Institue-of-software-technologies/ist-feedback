import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";

export class Course extends Model {
  id!: number;
  courseName!: string;
}

Course.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Course',
  tableName: 'Courses',
  timestamps: true,
});
