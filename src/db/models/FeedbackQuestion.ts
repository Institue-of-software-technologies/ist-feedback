import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";

export class FeedbackQuestion extends Model {
  id!: number;
  questionText!: string;
  questionType!: 'open-ended' | 'closed-ended' | 'rating';
  minRating?: number;
  maxRating?: number;
  ratingDescriptions?: Record<number, string>;
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
  },
  minRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  maxRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ratingDescriptions: {
    type: DataTypes.JSON,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('ratingDescriptions');
      return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
    },
  },
}, {
  sequelize,
  modelName: 'FeedbackQuestion',
  tableName: 'FeedbackQuestions',
  timestamps: true,
});
