import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { FeedbackQuestion } from './FeedbackQuestion';
import { Feedback } from './Feedback';

export class FeedbackAnswer extends Model {
  id!: number;
  questionId!: number; // Foreign key to FeedbackQuestions
  feedbackId!: number; // Foreign key to Feedback
  answerText!: string;
  description!: string;
  question?: FeedbackQuestion;
  feedback?: Feedback;
}

FeedbackAnswer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FeedbackQuestion,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  feedbackId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Feedback,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  answerText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'FeedbackAnswer',
  tableName: 'FeedbackAnswers',
  timestamps: true,
});

// Associations
FeedbackAnswer.belongsTo(FeedbackQuestion, {
  foreignKey: 'questionId',
  as: 'question',
});

FeedbackAnswer.belongsTo(Feedback, {
  foreignKey: 'feedbackId',
  as: 'feedback',
});
