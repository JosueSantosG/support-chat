"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const chatRooms_1 = __importDefault(require("./chatRooms"));
class Mensajes extends sequelize_1.Model {
}
Mensajes.init({
    id_mensaje: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: sequelize_1.DataTypes.INTEGER
    },
    id_chat: {
        type: sequelize_1.DataTypes.INTEGER
    },
    mensaje: {
        type: sequelize_1.DataTypes.STRING
    },
    tipo_usuario: {
        type: sequelize_1.DataTypes.STRING
    },
    hour: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    sequelize: connection_1.default,
    modelName: 'mensajes',
});
Mensajes.belongsTo(chatRooms_1.default, { foreignKey: 'id_chat' });
chatRooms_1.default.hasMany(Mensajes, { foreignKey: 'id_chat' });
exports.default = Mensajes;
//# sourceMappingURL=mensajes.js.map