import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import bd from '../database/connection';
import { Op, QueryTypes, where } from 'sequelize';
import ChatRooms from '../models/chatRooms';
import Mensajes from '../models/mensajes';
import Usuarios from '../models/usuarios';

interface JoinData {
    room: string;
}

interface MessageData {
    roomID: string;
    message: string;
    tipo_usuario: string;
}


export const socketHandler = (io: Server) => {
    io.on('connection', async (socket) => {
        console.log('Nuevo cliente conectado:', socket.id);
        
        // Enviar una notificación al cliente sobre la conexión
        socket.emit('connected', socket.id);
    
        // Unir a la sala
        socket.on('joinRoom', async (roomID) => {
            socket.join(roomID);
            // cargar mensajes
            const id_chat = Number(roomID);
            await Mensajes.findAll({ where: { id_chat: id_chat } }).then((mensajes) => {
                mensajes.forEach((mensaje) => {
                    const datas = {
                        id_mensaje: mensaje.id_mensaje.toString(),
                        message: mensaje.mensaje,
                        tipo_usuario: mensaje.tipo_usuario,
                    };
                    socket.emit('receiveMessage', datas);
                });
            });
            //io.to(roomID).emit('notification', `El cliente ${socket.id} se ha unido a la sala ${roomID}`);
            console.log(`Cliente ${socket.id} se unió a la sala ${roomID}`);
        });
    
        // Enviar mensaje a la sala
        socket.on('sendMessage', async (data: MessageData) => {
            try {
                const datas = {
                    message: data.message,
                    tipo_usuario: data.tipo_usuario,
                };
                const id_chat = Number(data.roomID);
                const result=await Mensajes.create({ id_chat: id_chat , mensaje: data.message, tipo_usuario: datas.tipo_usuario });
    
                socket.to(data.roomID).emit('receiveMessage', datas, {id_mensaje: result.id_mensaje.toString()});
                console.log(`Mensaje de ${datas.tipo_usuario} en la sala ${data.roomID}: ${data.message}`);
                console.log('Mensaje guardado');
            } catch (e) {
                console.log('Error al enviar mensaje:', e);
                
            }
            
        });
    
        // Desconectar
        socket.on('disconnect', () => {
            console.log(`Cliente ${socket.id} desconectado`);
        });

        if(!socket.recovered){
            try {
                const id_chat = Number(socket.handshake.auth.id_chat);
                const results = await Mensajes.findAll({ where: {[Op.and]:[{ id_chat: id_chat },{id_chat: { [Op.gt]: socket.handshake.auth.ServerOffSet ?? 0}}] }});
                results.forEach(async (result) => {
                    socket.emit("receiveMessage", {message: result.mensaje, id_mensaje: result.id_mensaje, tipo_usuario: result.tipo_usuario });
                });
                console.log('Mensajes recuperados: '+id_chat);
                
            } catch (e) {
                console.log(e);
            }
        }
    });
};

export const createUser = async (req: Request, res: Response) => {
    // Guardar en la bd el nombre del usuario y devolver el id de la sala de chat
    try {
    const { userName } = req.body;
    const [user]= await Usuarios.findOrCreate({where: { nombre: userName }});

    const existUserInChatRoom = await ChatRooms.findOne({ where: { id_usuario: user.id_usuario } });
    if (existUserInChatRoom) {
        return res.status(200).json({ result: existUserInChatRoom });
    } else {
        const createdChatRoom = await ChatRooms.create({ id_usuario: user.id_usuario, nombre_sala: userName });
        return res.status(200).json({ result: createdChatRoom });
    }
    } catch (e) {
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};