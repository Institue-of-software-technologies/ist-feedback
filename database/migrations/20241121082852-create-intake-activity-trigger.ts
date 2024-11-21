"use strict";

module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
    // Create AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_intake_insert
      AFTER INSERT ON Intakes
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Intake', NEW.id, 'Created', CONCAT('Intake ', NEW.intakeName, ' was created'), NOW());
      END
    `);

    // Create AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_intake_update
      AFTER UPDATE ON Intakes
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Intake', NEW.id, 'Updated', CONCAT('Intake ', NEW.intakeName, ' has been updated'), NOW());
      END
    `);
  },

  down: async (queryInterface: any) => {
    // Drop AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_intake_insert
    `);

    // Drop AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_intake_update
    `);
  },
};
