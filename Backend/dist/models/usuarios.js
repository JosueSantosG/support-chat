"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
// Definir la clase del modelo
class Usuarios extends sequelize_1.Model {
}
Usuarios.init({
    id_usuario: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
    },
    tipo_usuario: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'usuarios',
});
exports.default = Usuarios;
//# sourceMappingURL=usuarios.js.map