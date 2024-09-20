import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { Trainer } from './Trainer';
import { Course } from './Course';
import { ClassTime } from './ClassTime';

export class Feedback extends Model {
  id!: number;
  trainerId!: number;
  courseId!: number;
  classTimeId!: number;
  feedbackText!: string;
}

Feedback.init({
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
  classTimeId: {
    type: DataTypes.INTEGER,
    references: {
      model: ClassTime,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  feedbackText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Feedback',
  tableName: 'Feedback',
  timestamps: true,
});
