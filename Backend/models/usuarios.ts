import { DataTypes, Model, Optional } from "sequelize";
import db from "../database/connection";

// Interfaz de atributos del usuario
interface UsuarioAttributes {
    id_usuario: number;
    nombre: string;
    tipo_usuario: string;
}

// Interfaz de atributos opcionales para la creación
interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id_usuario'| 'tipo_usuario'> {}

// Definir la clase del modelo
class Usuarios extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
    public id_usuario!: number;
    public nombre!: string;
    public tipo_usuario!: string;
}

Usuarios.init({
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
    },
    tipo_usuario: {
        type: DataTypes.STRING,
    },
}, {
    sequelize: db,
    modelName: 'usuarios',
});

export default Usuarios;
