"use strict";

module.exports = {
  up: async (queryInterface : any, Sequelize : any) => {
    await queryInterface.addColumn("FeedbackQuestions", "required", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Optional questions by default
    });
  },

  down: async (queryInterface : any, Sequelize :any) => {
    await queryInterface.removeColumn("FeedbackQuestions", "required");
  },
};
