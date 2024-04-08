import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { UserInstance } from "./User";
import { MessageImageType } from "../Services/WebSocket";


export interface UserMessageInstance extends Model {
    uuid: string;
    fromUserUuid: string;
    user?: UserInstance;
    toUserUuid: string;
    imageUuid: string;
    imgs: MessageImageType[];
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    body: string;
    createdAt: string;
    updatedAt: string;
}

export const UserMessage = sequelize.define<UserMessageInstance>("UserMessage", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    fromUserUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    toUserUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    imageUuid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    imgs: {
        type: DataTypes.VIRTUAL,
        defaultValue: []
    },
    type: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        defaultValue: ""
    }
}, {
    timestamps: true
})