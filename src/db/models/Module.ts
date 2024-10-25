import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { Course } from './Course';

export class Module extends Model {
  id!: number;
  moduleName!: string;
  courseId!: number;

  course?: Course;
}

Module.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  moduleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Module',
  tableName: 'Modules',
  timestamps: true,
});

Module.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
