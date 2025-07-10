import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";
import { UserModel } from "./UserModel.js";

export const Comments = sequelize.define('comments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT("long"),
        allowNull: false
    },
    state: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    likes:{
    type:DataTypes.JSON,
    allowNull: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
}, {
    timestamps: true
});