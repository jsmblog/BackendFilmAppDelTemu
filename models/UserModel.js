import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const UserModel = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      photoProfile :{
        type:DataTypes.TEXT('long'),
        allowNull:true,
      }
  },
  {
    timestamps: false,
  }
);

