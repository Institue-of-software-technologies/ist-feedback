import { User } from './User';
import { Role } from './Role';
import { TrainerCourses } from './TrainerCourses';

// Define associations here
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

User.hasMany(TrainerCourses, { foreignKey: 'trainerId', as: 'trainerCourses' });
TrainerCourses.belongsTo(User, { foreignKey: 'trainerId', as: 'trainer' });

