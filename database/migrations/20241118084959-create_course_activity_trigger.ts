"use strict";

module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
    // Create AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_course_insert
      AFTER INSERT ON Courses
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Course', NEW.id, 'Created', CONCAT('Course ', NEW.courseName, ' was added'), NOW());
      END
    `);

    // Create AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_course_update
      AFTER UPDATE ON Courses
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Courses', NEW.id, 'Updated', CONCAT('The ', NEW.courseName, ' has been updated'), NOW());
      END
      `);
  },

  down: async (queryInterface: any) => {
    // Drop AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_course_insert
    `);

    // Drop AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_course_update
    `);
  },
};
