"use strict";

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.createTable("Sessions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      loginTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      logoutTime: {
        type: Sequelize.DATE,
        allowNull: true, // Logout time is null initially
      },
      duration: {
        type: Sequelize.INTEGER, // Time in seconds, can be calculated later
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  down: async (queryInterface:any) => {
    await queryInterface.dropTable("Sessions");
  },
};
