'use strict';

module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.createTable('AnswerOptions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      optionText: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      feedbackQuestionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FeedbackQuestions',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
  },

  down: async (queryInterface: any) => {
    await queryInterface.dropTable('AnswerOptions');
  },
};
