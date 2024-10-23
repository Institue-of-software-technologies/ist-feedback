import { DataTypes, Model } from 'sequelize';
import sequelize from "../db_connection";

export class Trainer extends Model {
  id!: number;
  name!: string;
  courseId!: number;
}

Trainer.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  trainerName: {
    type: DataTypes.STRING,
    allowNull: false,
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
  modelName: 'Trainer',
  tableName: 'Trainers',
  timestamps: true,
});
