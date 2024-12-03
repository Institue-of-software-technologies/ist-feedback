'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('Feedback','courseTrainerId',{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'trainer_courses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('Feedback', 'courseTrainerId');
  },
};