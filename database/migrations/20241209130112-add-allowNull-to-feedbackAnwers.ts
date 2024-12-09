"use strict";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.changeColumn("FeedbackAnswers", "answerText", {
      type: Sequelize.STRING,
      allowNull: true, 
    });

    // In case you need to conditionally change the answerText in future migrations based on requirements
    // You can add additional logic here if necessary, such as checking the required field of the question.
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.changeColumn("FeedbackAnswers", "answerText", {
      type: Sequelize.STRING,
      allowNull: false, 
    });
  },
};
