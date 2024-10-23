'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    

    await queryInterface.addColumn("Trainers", "CourseId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Courses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn("Trainers", "CourseId");
  }
};
