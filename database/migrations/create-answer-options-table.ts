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
        defaultValue: false,
      },
      feedbackQuestionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FeedbackQuestions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.dropTable('AnswerOptions');
  },
};
