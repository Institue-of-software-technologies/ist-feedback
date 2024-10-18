"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn("Intakes", "intakeYear", {
      type: Sequelize.STRING,
      allowNull: false, // Set to true if you want the column to be nullable
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.removeColumn("Intakes", "intakeYear");
  },
};
