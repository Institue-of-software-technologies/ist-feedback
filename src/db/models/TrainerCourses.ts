import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { Course } from './Course';
import { Trainer } from './Trainer';
import { User } from './User';

export class TrainerCourses extends Model {
  id!: number;
  trainerId!: number;
  courseId!: number;

  // This tells TypeScript that RolePermission has a 'permission' field when associated
  course?: Course;
  trainer?: User;
}

TrainerCourses.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  trainerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Trainer,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'TrainerCourses',
  tableName: 'Trainer_Courses',
  timestamps: false,
});
