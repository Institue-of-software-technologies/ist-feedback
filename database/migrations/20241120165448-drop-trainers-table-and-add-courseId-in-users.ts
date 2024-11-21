'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    // Add the CourseId column to the Users table
    await queryInterface.addColumn('Users', 'CourseId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null initially to avoid constraint issues
      references: {
        model: 'Courses', // Ensure this matches your Courses table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Fetch the roleId for 'trainer' from the Roles table
    const role = await queryInterface.sequelize.query(
      'SELECT id FROM Roles WHERE roleName = :roleName',
      {
        replacements: { roleName: 'trainer' }, // Assuming the roleName for trainers is 'trainer'
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!role || role.length === 0) {
      throw new Error('Role "trainer" not found in the Roles table');
    }

    const trainerRoleId = role[0].id;

    // Migrate data from Trainers to Users
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
          roleId: trainerRoleId,
          CourseId: null, 
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // Drop the Trainers table after data migration
    await queryInterface.dropTable('Trainers');

    // Make the CourseId column non-nullable if required
    await queryInterface.changeColumn('Users', 'CourseId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    // Recreate the Trainers table
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

    // Remove the CourseId column from Users
    await queryInterface.removeColumn('Users', 'CourseId');
  },
};
