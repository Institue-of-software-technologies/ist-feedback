'use strict';

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.renameColumn('FeedbackAnswers', 'userIp', 'AdminNo');
  },

  down: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.renameColumn('FeedbackAnswers', 'AdminNo', 'userIp');
  },
};
