'use strict';

/** @type {import('sequelize-cli').Migration} */
import { DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) =>  {
    await queryInterface.addColumn("ClassTimes", "classTimeStart", {
      type: DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("ClassTimes", "classTimeEnd", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface: any, Sequelize: any) =>{
    await queryInterface.removeColumn("ClassTimes", "classTimeStart");
    await queryInterface.removeColumn("ClassTimes", "classTimeEnd");
  }
};
