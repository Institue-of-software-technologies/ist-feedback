'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('FeedbackQuestions', 'questionType', {
      type: Sequelize.ENUM('open-ended', 'closed-ended', 'rating'),
      allowNull: false,
      defaultValue: 'open-ended',
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('FeedbackQuestions', 'questionType');
  },
};
