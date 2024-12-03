'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    // Step 1: Drop the existing foreign key constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE Feedback 
      DROP FOREIGN KEY feedback_ibfk_2;
    `);

    // Step 2: Remove the trainerId column
    await queryInterface.removeColumn('Feedback', 'trainerId');
  },

  down: async (queryInterface: any, Sequelize: any) => {
    // Step 1: Add the trainerId column back to Feedback
    await queryInterface.addColumn('Feedback', 'trainerId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });

    // Step 2: Recreate the foreign key constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE Feedback 
      ADD CONSTRAINT feedback_ibfk_2
      FOREIGN KEY (trainerId) 
      REFERENCES Users(id) 
      ON DELETE CASCADE;
    `);
  },
};
