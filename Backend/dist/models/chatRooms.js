"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
class ChatRooms extends sequelize_1.Model {
}
ChatRooms.init({
    id_chat: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: sequelize_1.DataTypes.INTEGER
    },
    id_asesor: {
        type: sequelize_1.DataTypes.INTEGER
    },
    nombre_sala: {
        type: sequelize_1.DataTypes.STRING
    },
    estado: {
        type: sequelize_1.DataTypes.STRING
    },
}, {
    sequelize: connection_1.default,
    modelName: 'chats',
});
exports.default = ChatRooms;
//# sourceMappingURL=chatRooms.js.map