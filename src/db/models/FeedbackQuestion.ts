import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";

export class FeedbackQuestion extends Model {
  id!: number;
  questionText!: string;
  questionType!: 'open-ended' | 'closed-ended' | 'rating';
  responses!: { [answerText: string]: { count: number; percentage: string } }
}

FeedbackQuestion.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  questionText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM('open-ended', 'closed-ended', 'rating'),
    allowNull: false,
    defaultValue: 'open-ended',
  },
}, {
  sequelize,
  modelName: 'FeedbackQuestion',
  tableName: 'FeedbackQuestions',
  timestamps: true,
});
