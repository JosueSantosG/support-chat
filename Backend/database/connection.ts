import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'
dotenv.config();

const dbName = process.env.NAME_DB  || 'bdsocketio';
const dbUser = process.env.USER     || 'root';
const dbPass = process.env.PASSWORD || 'admin';
const dbHost = process.env.HOST     || 'localhost';

const db = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'mysql',
    port:3306,
    define:{
        // Evitar que sequelize pluralice los nombres de las tablas
        freezeTableName:true
    }
    //logging:false,
});

export default db;