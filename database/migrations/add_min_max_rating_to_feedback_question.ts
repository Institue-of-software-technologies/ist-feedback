'use strict';

module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('FeedbackQuestions', 'minRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('FeedbackQuestions', 'maxRating', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.removeColumn('FeedbackQuestions', 'minRating');
    await queryInterface.removeColumn('FeedbackQuestions', 'maxRating');
  }
};
