import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";
import { UserModel } from "./UserModel.js";
import { Comments } from './Comments.js';

export const AllComments = sequelize.define('allComments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserModel,
            key: 'id'
        },
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    },
    id_comment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Comments,
            key: 'id'
        },
        onDelete:"CASCADE",
        onUpdate:'CASCADE'
    },
    id_movie:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})