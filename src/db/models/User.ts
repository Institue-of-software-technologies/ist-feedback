import { DataTypes, Model} from 'sequelize';
import sequelize from "../db_connection";
import { Role } from './Role';



export class User extends Model {
  id!: number;
  username!: string;
  email!: string;
  password!: string;
  roleId!: number;
  courseId!: number;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Courses',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  timestamps: true,
});

User.belongsTo(Role, { as: 'roleUsers', foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });


