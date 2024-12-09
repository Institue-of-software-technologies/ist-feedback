'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('Notifications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT, // Use TEXT for potentially longer messages
        allowNull: false,
      },
      link: {
        type: Sequelize.STRING, // Optional link for actions
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('unread', 'read', 'archived'),
        allowNull: false,
        defaultValue: 'unread',
      },
      priority: {
        type: Sequelize.ENUM('low', 'normal', 'high'),
        allowNull: false,
        defaultValue: 'normal',
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true, // Nullable for non-expiring notifications
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface: any) => {
    await queryInterface.dropTable('Notifications'); // Correct table name
  },
};
