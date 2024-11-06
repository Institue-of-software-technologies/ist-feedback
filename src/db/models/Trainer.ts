import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { Course } from './Course';

export class Trainer extends Model {
  id!: number;
  trainerName!: string;
  email!: string;
  courseId!: number;

  courses?: Course;
}

Trainer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  trainerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Courses',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Trainer',
  tableName: 'Trainers',
  timestamps: true,
});
// Define associations between RolePermission and Permission, Role
Trainer.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
