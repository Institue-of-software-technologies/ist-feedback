"use strict";

import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface : any, Sequelize : any) => {
    await queryInterface.addColumn("Feedback", "tokenStartTime", {
      type: Sequelize.DATE,
      allowNull: true, // Set to true if not mandatory; adjust as needed
      after: "studentToken", // Specify the column order
    });
  },

  down: async (queryInterface : any, Sequelize :any) => {
    await queryInterface.removeColumn("Feedback", "tokenStartTime");
  },
};
