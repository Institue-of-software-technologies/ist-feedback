import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { FeedbackQuestion } from './FeedbackQuestion';
import { Feedback } from './Feedback';

export class FeedbackAnswer extends Model {
  id!: number;
  feedbackQuestionId!: number; // Foreign key to FeedbackQuestions
  feedbackId!: number; // Foreign key to Feedback
  answerText!: string;
}

FeedbackAnswer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  feedbackQuestionId: {
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
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'FeedbackAnswer',
  tableName: 'FeedbackAnswers',
  timestamps: true,
});

// Associations
FeedbackAnswer.belongsTo(FeedbackQuestion, {
  foreignKey: 'feedbackQuestionId',
  as: 'question',
});

FeedbackAnswer.belongsTo(Feedback, {
  foreignKey: 'feedbackId',
  as: 'feedback',
});
