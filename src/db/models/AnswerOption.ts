import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";
import { FeedbackQuestion } from './FeedbackQuestion';

export class AnswerOption extends Model {
  id!: number;
  optionText!: string;
  feedbackQuestionId!: number;
  feedbackQuestion?: FeedbackQuestion;
}

AnswerOption.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  optionText: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false
  },
  feedbackQuestionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FeedbackQuestion,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  description: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'AnswerOption',
  tableName: 'AnswerOptions',
  timestamps: true,
});

FeedbackQuestion.hasMany(AnswerOption, {
  foreignKey: 'feedbackQuestionId',
  as: "answerOption"
});

AnswerOption.belongsTo(FeedbackQuestion, {
  foreignKey: "feedbackQuestionId",
  as: "answerOption",
});
