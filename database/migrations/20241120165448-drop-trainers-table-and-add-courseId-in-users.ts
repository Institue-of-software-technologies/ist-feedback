'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    // Step 1: Add the CourseId column to Users (if not done already)
    await queryInterface.addColumn('Users', 'CourseId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Courses',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Step 2: Update foreign keys pointing to Trainers
    await queryInterface.sequelize.query(`
      ALTER TABLE Feedback 
      DROP FOREIGN KEY feedback_ibfk_2;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Feedback 
      ADD CONSTRAINT feedback_ibfk_2 
      FOREIGN KEY (trainerId) 
      REFERENCES Users(id) 
      ON DELETE CASCADE;
    `);

    // Step 3: Migrate data from Trainers to Users
    const trainers = await queryInterface.sequelize.query(
      'SELECT * FROM Trainers',
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const trainer of trainers) {
      await queryInterface.bulkInsert('Users', [
        {
          username: trainer.trainerName,
          email: trainer.email,
          password: '',
          roleId: null, // Assign appropriate role ID if required
          CourseId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // Step 4: Drop the Trainers table
    await queryInterface.dropTable('Trainers');
  },

  down: async (queryInterface: any, Sequelize: any) => {
    // Step 1: Recreate the Trainers table
    await queryInterface.createTable('Trainers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      trainerName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Step 2: Update foreign keys to point back to Trainers
    await queryInterface.sequelize.query(`
      ALTER TABLE feedback 
      DROP FOREIGN KEY feedback_ibfk_2;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE feedback 
      ADD CONSTRAINT feedback_ibfk_2 
      FOREIGN KEY (trainerId) 
      REFERENCES Users(id) 
      ON DELETE CASCADE;
    `);

    // Step 3: Remove the CourseId column from Users
    await queryInterface.removeColumn('Users', 'CourseId');
  },
};
