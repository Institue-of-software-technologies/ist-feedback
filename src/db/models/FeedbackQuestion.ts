import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";

export class FeedbackQuestion extends Model {
  id!: number;
  questionText!: string;
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
}, {
  sequelize,
  modelName: 'FeedbackQuestion',
  tableName: 'FeedbackQuestions',
  timestamps: true,
});
