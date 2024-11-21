'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('FeedbackQuestions', 'ratingDescriptions', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.removeColumn('FeedbackQuestions', 'ratingDescriptions');
  }
};
