"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbName = process.env.NAME_DB || 'bdsocketio';
const dbUser = process.env.USER || 'root';
const dbPass = process.env.PASSWORD || 'admin';
const dbHost = process.env.HOST || 'localhost';
const db = new sequelize_1.Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'mysql',
    port: 3306,
    define: {
        // Evitar que sequelize pluralice los nombres de las tablas
        freezeTableName: true
    }
    //logging:false,
});
exports.default = db;
//# sourceMappingURL=connection.js.map