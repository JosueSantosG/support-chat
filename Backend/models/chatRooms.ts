import { DataTypes, Model, Optional } from "sequelize";
import db from "../database/connection";

interface ChatRoomsAttributes {
    id_chat: number;
    id_usuario: number;
    id_asesor: number;
    nombre_sala: string;
    estado: string;
}

interface ChatRoomsCreationAttributes extends Optional<ChatRoomsAttributes, 'id_chat'| 'id_usuario' | 'id_asesor' | 'estado'> {}

class ChatRooms extends Model<ChatRoomsAttributes, ChatRoomsCreationAttributes> implements ChatRoomsAttributes {
    public id_chat!: number;
    public id_usuario!: number;
    public id_asesor!: number;
    public nombre_sala!: string;
    public estado!: string;
}


ChatRooms.init( {
    id_chat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    id_asesor: {
        type: DataTypes.INTEGER
    },
    nombre_sala: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    },
    
},
{
    sequelize: db,
    modelName: 'chats',

});

export default ChatRooms;