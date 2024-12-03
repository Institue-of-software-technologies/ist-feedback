"use strict";

module.exports = {
    up: async (queryInterface: any, Sequelize: any) => {
    // Create AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_feedback_questions_insert
      AFTER INSERT ON FeedbackQuestions
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Feedbackquestions', NEW.id, 'Created', CONCAT('A new ', NEW.questionType, ' question has been posted'), NOW());
      END
    `);

    // Create AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      CREATE TRIGGER after_feedback_questions_update
      AFTER UPDATE ON FeedbackQuestions
      FOR EACH ROW
      BEGIN
        INSERT INTO RecentActivities (entityType, entityId, activityType, description, timestamp)
        VALUES ('Feedbackquestions', NEW.id, 'Updated', CONCAT('The ', NEW.questionType, ' question with ID ', NEW.id, ' has been updated'), NOW());
      END
    `);
  },

  down: async (queryInterface: any) => {
    // Drop AFTER INSERT trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_feedback_questions_insert;
    `);

    // Drop AFTER UPDATE trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_feedback_questions_update;
    `);
  },
};
