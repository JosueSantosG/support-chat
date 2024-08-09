import {Sequelize} from 'sequelize'


const db= new Sequelize('bdsocketio', 'root', 'admin',{
    host: 'localhost',
    dialect: 'mysql',
    port:3306,
    define:{
        // Evitar que sequelize pluralice los nombres de las tablas
        freezeTableName:true
    }
    //logging:false,
});



export default db;