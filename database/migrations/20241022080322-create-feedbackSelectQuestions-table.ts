"use strict";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable("Feedback_Select_Questions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      feedbackId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Feedback",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      feedbackQuestionsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "FeedbackQuestions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface: any) => {
    await queryInterface.dropTable("Feedback_Select_Questions");
  },
};
