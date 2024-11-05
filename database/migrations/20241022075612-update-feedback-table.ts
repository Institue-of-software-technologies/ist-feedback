"use strict";

import { DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {

    await queryInterface.removeColumn("Feedback", "userId");

    await queryInterface.addColumn("Feedback", "studentToken", {
      type: DataTypes.STRING,
      allowNull: false,
    }); 
       
    await queryInterface.addColumn("Feedback", "tokenExpiration", {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    });

    await queryInterface.addColumn("Feedback", "intakeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Intakes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("Feedback", "classTimeId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ClassTimes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("Feedback", "moduleId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Modules",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

  },

  down: async (queryInterface: any, Sequelize: any) => {
    // Revert the changes made in the 'up' method
    await queryInterface.addColumn("Feedback", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Remove added columns
    await queryInterface.removeColumn("Feedback", "studentToken");
    await queryInterface.removeColumn("Feedback", "intakeId");
    await queryInterface.removeColumn("Feedback", "classTimeId");
    await queryInterface.removeColumn("Feedback", "moduleId");
    await queryInterface.removeColumn("Feedback", "tokenExpiration");
  },
};
