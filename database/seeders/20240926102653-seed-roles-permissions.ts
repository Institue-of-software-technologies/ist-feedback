import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface: QueryInterface) {
    // Define roles, permissions, and users
    enum Roles {
      SUPER_ADMIN = 'super_admin',
      ADMIN = 'admin',
      STUDENT = 'student',
    }

    enum Permissions {
      // Super Admin Permissions
      CREATE_USERS = 'create_users',
      VIEW_USERS = 'view_users',
      UPDATE_USERS = 'update_users',
      DELETE_USERS = 'delete_users',
      ASSIGN_ROLES = 'assign_roles',
      USER_MANAGEMENT = 'manage_users',

      CREATE_ROLES = 'create_roles',
      VIEW_ROLES = 'view_roles',
      UPDATE_ROLES = 'update_roles',
      DELETE_ROLES = 'delete_roles',
      ASSIGN_PERMISSIONS = 'assign_permissions',
      ROLE_MANAGEMENT= 'manage_roles',
 
      CREATE_PERMISSIONS = 'create_permissions',
      VIEW_PERMISSIONS = 'view_permissions',
      UPDATE_PERMISSIONS = 'update_permissions',
      DELETE_PERMISSIONS='delete_permissions',
      PERMISSION_MANAGEMENT = 'manage_permissions',

      // Admin Permissions
      CREATE_FEEDBACK_QUESTIONS = 'create_feedback_questions',
      VIEW_FEEDBACK_QUESTIONS = 'view_feedback_questions',
      UPDATE_FEEDBACK_QUESTIONS = 'update_feedback_questions',
      DELETE_FEEDBACK_QUESTIONS = 'delete_feedback_questions',
      FEEDBACK_MANAGEMENT = 'manage_feedback',

      CREATE_INTakes = 'create_intakes',
      VIEW_INTakes = 'view_intakes',
      UPDATE_INTakes = 'update_intakes',
      DELETE_INTakes = 'delete_intakes',
      INTake_MANAGEMENT = 'manage_intakes',

      CREATE_CLASS_TIMES = 'create_class_times',
      VIEW_CLASS_TIMES = 'view_class_times',
      UPDATE_CLASS_TIMES = 'update_class_times',
      DELETE_CLASS_TIMES = 'delete_class_times',
      CLASS_TIME_MANAGEMENT = 'manage_class_time',

      CREATE_COURSES = 'create_courses',
      VIEW_COURSES = 'view_courses',
      UPDATE_COURSES = 'update_courses',
      DELETE_COURSES = 'delete_courses',
      ASSIGN_MODULES = 'assign_modules',
      COURSE_MANAGEMENT = 'manage_courses',

      CREATE_TRAINERS = 'create_trainers',
      VIEW_TRAINERS = 'view_trainers',
      UPDATE_TRAINERS = 'update_trainers',
      DELETE_TRAINERS = 'delete_trainers',
      ASSIGN_TRAINERS = 'assign_trainers',
      TRAINER_MANAGEMENT = 'manage_trainers',

      GENERATE_FEEDBACK_TOKENS = 'generate_feedback_tokens',
      ASSIGN_FEEDBACK_QUESTIONS = 'assign_feedback_questions',
      SET_TOKEN_EXPIRY = 'set_token_expiry',
      VIEW_FEEDBACK_RESULTS = 'view_feedback_results',
      SEND_FEEDBACK_REPORTS = 'send_feedback_reports',

      // Student Permissions
      SUBMIT_FEEDBACK = 'submit_feedback',
      VIEW_FEEDBACK = 'view_feedback',

      // General Permissions
      VIEW_DASHBOARD = 'view_dashboard',
      RECEIVE_NOTIFICATIONS = 'receive_notifications',

      //update_admin_Permissions
      MANAGE_MODULES='manage_modules',
      UPDATE_MODULES='update_modules',
      DELETE_MODULES='delete_modules',
      VIEW_MODULES='view_modules',

      UPDATE_FEEDBACKS='update_feedbacks',
      DELETE_FEEDBACKS='delete_feedbacks',
      VIEW_FEEDBACKS = 'view_feedbacks',
    }

    // Hash passwords
    const hashedPasswordSam = await bcrypt.hash('sam123', 10);
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);

    // Insert roles
    await queryInterface.bulkInsert('Roles', [
      {
        roleName: Roles.SUPER_ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: Roles.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        roleName: Roles.STUDENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert permissions
    const permissions = Object.values(Permissions).map(permission => ({
      permissionName: permission,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Permissions', permissions);

    // Insert users with assigned roles
    await queryInterface.bulkInsert('Users', [
      {
        username: 'sam',
        email: 'sam@example.com',
        password: hashedPasswordSam, // Hashed password for Sam
        roleId: 2, // Assuming the ID for ADMIN is automatically set to 2
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPasswordAdmin, // Hashed password for Admin
        roleId: 1, // Assuming the ID for SUPER_ADMIN is automatically set to 1
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create role-permission relationships for Super Admin
    await queryInterface.bulkInsert('Role_Permissions', [
      // Super Admin Permissions
      { roleId: 1, permissionId: 1, createdAt: new Date(), updatedAt: new Date() }, // CREATE_USERS
      { roleId: 1, permissionId: 2, createdAt: new Date(), updatedAt: new Date() }, // VIEW_USERS
      { roleId: 1, permissionId: 3, createdAt: new Date(), updatedAt: new Date() }, // UPDATE_USERS
      { roleId: 1, permissionId: 4, createdAt: new Date(), updatedAt: new Date() }, // DELETE_USERS
      { roleId: 1, permissionId: 5, createdAt: new Date(), updatedAt: new Date() }, // ASSIGN_ROLES
      { roleId: 1, permissionId: 6, createdAt: new Date(), updatedAt: new Date() }, // USER_MANAGEMENT
  
      { roleId: 1, permissionId: 7, createdAt: new Date(), updatedAt: new Date() }, // CREATE_ROLES
      { roleId: 1, permissionId: 8, createdAt: new Date(), updatedAt: new Date() }, // VIEW_ROLES
      { roleId: 1, permissionId: 9, createdAt: new Date(), updatedAt: new Date() }, // UPDATE_ROLES
      { roleId: 1, permissionId: 10, createdAt: new Date(), updatedAt: new Date() }, // DELETE_ROLES
      { roleId: 1, permissionId: 11, createdAt: new Date(), updatedAt: new Date() }, // ASSIGN_PERMISSIONS
      { roleId: 1, permissionId: 12, createdAt: new Date(), updatedAt: new Date() }, // ROLE_MANAGEMENT
  
      { roleId: 1, permissionId: 13, createdAt: new Date(), updatedAt: new Date() }, // CREATE_PERMISSIONS
      { roleId: 1, permissionId: 14, createdAt: new Date(), updatedAt: new Date() }, // VIEW_PERMISSIONS
      { roleId: 1, permissionId: 15, createdAt: new Date(), updatedAt: new Date() }, // UPDATE_PERMISSIONS
      { roleId: 1, permissionId: 16, createdAt: new Date(), updatedAt: new Date() }, // DELETE_PERMISSIONS
      { roleId: 1, permissionId: 17, createdAt: new Date(), updatedAt: new Date() }, // PERMISSION_MANAGEMENT
  
      // Admin Permissions
      { roleId: 2, permissionId: 18, createdAt: new Date(), updatedAt: new Date() }, // CREATE_FEEDBACK_QUESTIONS
      { roleId: 2, permissionId: 19, createdAt: new Date(), updatedAt: new Date() }, // VIEW_FEEDBACK_QUESTIONS
      { roleId: 2, permissionId: 20, createdAt: new Date(), updatedAt: new Date() }, // UPDATE_FEEDBACK_QUESTIONS
      { roleId: 2, permissionId: 21, createdAt: new Date(), updatedAt: new Date() }, // DELETE_FEEDBACK_QUESTIONS
      { roleId: 2, permissionId: 22, createdAt: new Date(), updatedAt: new Date() }, // FEEDBACK_MANAGEMENT
  
      { roleId: 2, permissionId: 23, createdAt: new Date(), updatedAt: new Date() }, // CREATE_INTAKES
      { roleId: 2, permissionId: 24, createdAt: new Date(), updatedAt: new Date() }, // VIEW_INTAKES
      { roleId: 2, permissionId: 25, createdAt: new Date(), updatedAt: new Date() }, // UPDATE_INTAKES
      { roleId: 2, permissionId: 26, createdAt: new Date(), updatedAt: new Date() }, // DELETE_INTAKES
      { roleId: 2, permissionId: 27, createdAt: new Date(), updatedAt: new Date() }, // INTAKE_MANAGEMENT
  
      { roleId: 2, permissionId: 28, createdAt: new Date(), updatedAt: new Date() }, // CREATE_CLASS_TIMES
      { roleId: 2, permissionId: 29, createdAt: new Date(), updatedAt: new Date() }, // VIEW_CLASS_TIMES
      { roleId: 2, permissionId: 30, createdAt: new Date(), updatedAt: new Date() }, // UPDATE_CLASS_TIMES
      { roleId: 2, permissionId: 31, createdAt: new Date(), updatedAt: new Date() }, // DELETE_CLASS_TIMES
      { roleId: 2, permissionId: 32, createdAt: new Date(), updatedAt: new Date() }, // CLASS_TIME_MANAGEMENT
  
      { roleId: 2, permissionId: 33, createdAt: new Date(), updatedAt: new Date() }, // CREATE_COURSES
      { roleId: 2, permissionId: 34, createdAt: new Date(), updatedAt: new Date() }, // VIEW_COURSES
      { roleId: 2, permissionId: 35, createdAt: new Date(), updatedAt: new Date() }, // UPDATE_COURSES
      { roleId: 2, permissionId: 36, createdAt: new Date(), updatedAt: new Date() }, // DELETE_COURSES
      { roleId: 2, permissionId: 37, createdAt: new Date(), updatedAt: new Date() }, // ASSIGN_MODULES
      { roleId: 2, permissionId: 38, createdAt: new Date(), updatedAt: new Date() }, // COURSE_MANAGEMENT
  
      { roleId: 2, permissionId: 39, createdAt: new Date(), updatedAt: new Date() }, // CREATE_TRAINERS
      { roleId: 2, permissionId: 40, createdAt: new Date(), updatedAt: new Date() }, // VIEW_TRAINERS
      { roleId: 2, permissionId: 41, createdAt: new Date(), updatedAt: new Date()}, // UPDATE_TRAINERS
      { roleId: 2, permissionId: 42, createdAt: new Date(), updatedAt: new Date() }, // DELETE_TRAINERS
      { roleId: 2, permissionId: 43, createdAt: new Date(), updatedAt: new Date() }, // ASSIGN_TRAINERS
      { roleId: 2, permissionId: 44, createdAt: new Date(), updatedAt: new Date() }, // TRAINER_MANAGEMENT

      { roleId: 2, permissionId: 45, createdAt: new Date(), updatedAt: new Date() }, // GENERATE_FEEDBACK_TOKENS
      { roleId: 2, permissionId: 46, createdAt: new Date(), updatedAt: new Date() }, // ASSIGN_FEEDBACK_QUESTIONS
      { roleId: 2, permissionId: 47, createdAt: new Date(), updatedAt: new Date() }, // SET_TOKEN_EXPIRY
      { roleId: 2, permissionId: 48, createdAt: new Date(), updatedAt: new Date() }, // VIEW_FEEDBACK_RESULTS
      { roleId: 2, permissionId: 49, createdAt: new Date(), updatedAt: new Date() }, // SEND_FEEDBACK_REPORTS

      // Student Permissions
      { roleId: 3, permissionId: 50, createdAt: new Date(), updatedAt: new Date() }, // SUBMIT_FEEDBACK
      { roleId: 3, permissionId: 51, createdAt: new Date(), updatedAt: new Date() }, // VIEW_FEEDBACK

      { roleId: 1, permissionId: 52, createdAt: new Date(), updatedAt: new Date() }, // VIEW_DASHBOARD
      { roleId: 1, permissionId: 53, createdAt: new Date(), updatedAt: new Date() }, // RECEIVE_NOTIFICATIONS
      { roleId: 2, permissionId: 52, createdAt: new Date(), updatedAt: new Date() }, // VIEW_DASHBOARD
      { roleId: 2, permissionId: 53, createdAt: new Date(), updatedAt: new Date() }, // RECEIVE_NOTIFICATIONS

      //update_admin_Permissions
      { roleId: 2, permissionId: 54, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 55, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 56, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 57, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 58, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 59, createdAt: new Date(), updatedAt: new Date() },
      { roleId: 2, permissionId: 60, createdAt: new Date(), updatedAt: new Date() },
]);


    
},

async down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('Role_Permissions', {}, {});
  await queryInterface.bulkDelete('Permissions', {}, {});
  await queryInterface.bulkDelete('Roles', {}, {});
  await queryInterface.bulkDelete('Users', {}, {});
},
};