"use script";

module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
    // Create AFTER INSERT trigger
    await queryInterface.sequelize.query(`
        CREATE TRIGGER after_classtime_insert
        AFTER INSERT ON ClassTimes
        FOR EACH ROW
        BEGIN
            INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
            VALUES ('Classtime', NEW.id, 'Created', CONCAT('New classtime', NEW.classTime, ' was added'), NOW());
        END
        `);

        // Create AFTER UPDATE trigger
        await queryInterface.sequelize.query(`
            CREATE TRIGGER after_classtime_update
            AFTER UPDATE ON ClassTimes
            FOR EACH ROW
            BEGIN
              INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
              VALUES ('Classtime', NEW.id, 'Updated', CONCAT('Classtime ', NEW.classTime, ' has been updated'), NOW());
            END
        `);
    },

    down: async (queryInterface: any) => {
        // Drop AFTER INSERT trigger
        await queryInterface.sequelize.query(`
          DROP TRIGGER IF EXISTS after_classtime_insert
        `);
    
        // Drop AFTER UPDATE trigger
        await queryInterface.sequelize.query(`
          DROP TRIGGER IF EXISTS after_classtime_update
        `);
    },
}