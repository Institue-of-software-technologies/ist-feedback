"use strict";

module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
    // Create AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_user_insert
      AFTER INSERT ON Users
      FOR EACH ROW
      BEGIN
        INSERT INTO recentactivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('User', NEW.id, 'Created', CONCAT('User ', NEW.username, ' was created'), NOW());
      END
    `);

    // Create AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_user_update
      AFTER UPDATE ON Users
      FOR EACH ROW
      BEGIN
        INSERT INTO recentactivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('User', NEW.id, 'Updated', CONCAT('User ', NEW.username, ' has been updated'), NOW());
      END
      `);
  },

  down: async (queryInterface: any) => {
    // Drop AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_user_insert
    `);

    // Drop AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_user_update
    `);
  },
};
