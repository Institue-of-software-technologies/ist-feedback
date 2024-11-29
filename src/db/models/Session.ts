import { DataTypes, Model } from "sequelize";
import sequelize from "../db_connection";
import { User } from "./User";

export class Session extends Model {
  id!: number;
  userId!: number;
  loginTime!: Date;
  logoutTime!: Date;
  duration!: number;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    loginTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    logoutTime: {
      type: DataTypes.DATE,
      allowNull: true, // Logout time is null initially
    },
    duration: {
      type: DataTypes.INTEGER, // Time in seconds, can be calculated later
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Session",
    tableName: "Sessions",
    timestamps: true,
  }
);

Session.belongsTo(User, { foreignKey: "userId" });