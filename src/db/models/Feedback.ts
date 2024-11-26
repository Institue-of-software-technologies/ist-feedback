import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { ClassTime } from './ClassTime';
import { Module } from './Module';
import { Intake } from './Intake';
import { FeedbackAnswer } from './FeedbackAnswer';
import { User } from './User';

export class Feedback extends Model {
  id!: number;
  trainerId!: number;
  intakeId!: number;
  classTimeId!: number;
  moduleId!: number;
  studentToken!: string;
  tokenStartTime!: Date;
  tokenExpiration!: Date;
  
  trainer?: User;
  // intake?: Intake; // Add this manually for TypeScript to recognize the association
  classTime?: ClassTime;
  module?: Module;
  feedbackAnswers?: FeedbackAnswer[];
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
      model: User,
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
  moduleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Module,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },  
  intakeId: {
    type: DataTypes.INTEGER,
    references: {
      model: Intake,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  studentToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },  
  tokenStartTime: {
    type: DataTypes.DATE,
    allowNull: false, 
  },
  tokenExpiration: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Feedback',
  tableName: 'Feedback',
  timestamps: true,
});

Feedback.belongsTo(User, {
  foreignKey: "trainerId",
  as: "trainer", 
});
Feedback.belongsTo(Module, {
  foreignKey: "moduleId",
  as: "module",
});

Feedback.belongsTo(ClassTime, {
  foreignKey: "classTimeId",
  as: "classTime",
});
Feedback.belongsTo(Intake, {
  foreignKey: "intakeId",
  as: "intake",
});

