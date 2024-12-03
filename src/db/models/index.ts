import { User } from './User';
import { Course } from './Course';
import { TrainerCourses } from './TrainerCourses';

// Define the many-to-many relationship between User and Course through TrainerCourses
User.belongsToMany(Course, {
  through: TrainerCourses,
  foreignKey: 'trainerId', // The key in TrainerCourses that references User
  otherKey: 'courseId', // The key in TrainerCourses that references Course
  as: 'user_courses', // Alias to access related courses for a user
});

Course.belongsToMany(User, {
  through: TrainerCourses,
  foreignKey: 'courseId', // The key in TrainerCourses that references Course
  otherKey: 'trainerId', // The key in TrainerCourses that references User
  as: 'course_trainers', // Alias to access related trainers for a course
});

// Direct association between User and TrainerCourses
User.hasMany(TrainerCourses, {
  foreignKey: 'trainerId', // The key in TrainerCourses that references User
  as: 'trainer_courses', // Alias to access related trainer courses
});

TrainerCourses.belongsTo(User, {
  foreignKey: 'trainerId', // The key in TrainerCourses that references User
  as: 'trainers_users', // Alias to access related user (trainer)
});

Course.hasMany(TrainerCourses, {
  foreignKey: 'courseId', // The key in TrainerCourses that references User
  as: 'Courses_trainers', // Alias to access related trainer courses
});

TrainerCourses.belongsTo(Course, {
  foreignKey: 'courseId', // The key in TrainerCourses that references User
  as: 'course', // Alias to access related user (trainer)
});

// Export the models
export { User, Course, TrainerCourses };
