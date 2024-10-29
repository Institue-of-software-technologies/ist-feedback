import { DataTypes, Model } from "sequelize";
import sequelize from "../db_connection";
import { Feedback } from "./Feedback";
import { FeedbackQuestion } from "./FeedbackQuestion";

export class FeedbackSelectQuestions extends Model {
  feedbackId!: number;
  feedbackQuestionsId!: number;

  // This tells TypeScript that RolePermission has a 'permission' field when associated
  feedback?: Feedback;
}

FeedbackSelectQuestions.init(
  {
    feedbackId: {
      type: DataTypes.INTEGER,
      references: {
        model: Feedback,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    feedbackQuestionsId: {
      type: DataTypes.INTEGER,
      references: {
        model: FeedbackQuestion,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "FeedbackSelectQuestions",
    tableName: "Feedback_Select_Questions",
    timestamps: false,
  }
);

// Define associations between RolePermission and Permission, Role
FeedbackSelectQuestions.belongsTo(Feedback, {
  foreignKey: "feedbackId",
  as: "feedbackselect",
});
FeedbackSelectQuestions.belongsTo(FeedbackQuestion, { foreignKey: "feedbackQuestionId", as: "feedbackQuestion" });
