'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn("AnswerOptions", "description", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.removeColumn("AnswerOptions", "description");
  },
};
