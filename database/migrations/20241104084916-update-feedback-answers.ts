'use strict';

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.removeColumn("FeedbackAnswers", "AdminNo");
  },

  down: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.removeColumn("FeedbackAnswers", "AdminNo");
  },
};
