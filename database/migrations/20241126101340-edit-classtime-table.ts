'use strict';

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.removeColumn("ClassTimes", "classTimeStart");
    await queryInterface.removeColumn("ClassTimes", "classTimeEnd");
  },

  down: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.removeColumn("ClassTimes", "classTimeStart");
    await queryInterface.removeColumn("ClassTimes", "classTimeEnd");
  },
};
