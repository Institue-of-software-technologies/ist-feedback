'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('FeedbackAnswers', 'userIp', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('FeedbackAnswers', 'userIp');
  },
};
