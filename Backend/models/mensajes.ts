import { DataTypes, Model, Optional } from "sequelize";
import db from "../database/connection";
import ChatRooms from "./chatRooms";

interface MensajesAttributes {
    id_mensaje: number;
    id_usuario: number;
    id_chat: number;
    mensaje: string;
    tipo_usuario: string;
    hour: string;
}

interface MensajesCreationAttributes extends Optional<MensajesAttributes, "id_mensaje" | "id_usuario" > {}

class Mensajes extends Model<MensajesAttributes, MensajesCreationAttributes> implements MensajesAttributes {
    public id_mensaje!: number;
    public id_usuario!: number;
    public id_chat!: number;
    public mensaje!: string;
    public tipo_usuario!: string;
    public hour!: string;
}


Mensajes.init({
    id_mensaje: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    id_chat: {
        type: DataTypes.INTEGER
    },
    mensaje: {
        type: DataTypes.STRING
    },
    tipo_usuario: {
        type: DataTypes.STRING
    },
    hour: {
        type: DataTypes.STRING
    }
    
},
{
    sequelize: db,
    modelName: 'mensajes',
}

);

Mensajes.belongsTo(ChatRooms, { foreignKey: 'id_chat' });
ChatRooms.hasMany(Mensajes, { foreignKey: 'id_chat' });

export default Mensajes;