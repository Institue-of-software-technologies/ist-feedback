import { DataTypes, Model } from 'sequelize';
import sequelize from '../db_connection';
import { User } from './User';

export class Notification extends Model {
  id!: number;
  userId!: number;
  title!: string;
  message!: string;
  link?: string;
  status!: 'unread' | 'read' | 'archived';
  priority!: 'low' | 'normal' | 'high';
  expiresAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;

  // Association fields
  user?: User;
}

Notification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT, // Allows for longer notification messages
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING, // Nullable, as not all notifications will have a link
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'archived'),
    allowNull: false,
    defaultValue: 'unread',
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high'),
    allowNull: false,
    defaultValue: 'normal',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true, // Nullable for notifications that do not expire
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'Notifications',
  timestamps: true,
});

export default Notification;
