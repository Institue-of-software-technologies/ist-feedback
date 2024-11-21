"use strict";

module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
    // Create AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_trainer_insert
      AFTER INSERT ON Trainers
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Trainer', NEW.id, 'Created', CONCAT('Trainer ', NEW.trainerName, ' was created'), NOW());
      END
    `);

    // Create AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_trainer_update
      AFTER UPDATE ON Trainers
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Trainer', NEW.id, 'Updated', CONCAT('Trainer ', NEW.trainerName, ' has been updated'), NOW());
      END
    `);
  },

  down: async (queryInterface: any) => {
    // Drop AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_trainer_insert
    `);

    // Drop AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_trainer_update
    `);
  },
};
