'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: any, Sequelize: any) {
    // Add the 'acceptInvite' column to the 'users' table
    await queryInterface.addColumn('Users', 'acceptInvite', {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Set the default value to false
      allowNull: false, // Make it non-nullable
    });
  },

  async down (queryInterface: any, Sequelize: any) {
    // Remove the 'acceptInvite' column from the 'users' table
    await queryInterface.removeColumn('users', 'acceptInvite');
  }
};

