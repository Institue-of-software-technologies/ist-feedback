'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    // Create AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_module_insert
      AFTER INSERT ON Modules
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Module', NEW.id, 'Created', CONCAT('Module ', NEW.moduleName, ' was created'), NOW());
      END
    `);

    // Create AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_module_update
      AFTER UPDATE ON Modules
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Module', NEW.id, 'Updated', CONCAT('Module ', NEW.moduleName, ' has been updated'), NOW());
      END
    `);
  },

  down: async (queryInterface: any) => {
    // Drop AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_module_insert
    `);

    // Drop AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_module_update
    `);
  },
};
