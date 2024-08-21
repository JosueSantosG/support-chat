"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize('bdsocketio', 'root', 'admin', {
    host: 'localhost',
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