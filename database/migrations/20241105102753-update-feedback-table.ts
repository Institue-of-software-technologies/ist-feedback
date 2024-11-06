'use strict';

/** @type {import('sequelize-cli').Migration} */
import { DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) =>  {
    await queryInterface.addColumn("Trainers", "email", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface: any, Sequelize: any) =>{
    await queryInterface.removeColumn("Trainers", "email");
  }
};
