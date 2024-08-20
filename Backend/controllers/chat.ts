import { Request, Response } from "express";
import { Server } from "socket.io";
import { Op} from "sequelize";
import ChatRooms from "../models/chatRooms";
import Mensajes from "../models/mensajes";
import Usuarios from "../models/usuarios";


interface MessageData {
	roomID: string;
	message: string;
	tipo_usuario: string;
	hour: string;
}

export const socketHandler = (io: Server) => {
	io.on("connection", async (socket) => {
        // Set para almacenar las salas que ya han tenido un asesor unido
        const roomsWithAsesor = new Set();

        // Crear usuario
        socket.on("createUser", async (userName: string) => {
            try {
                // Buscar usuario en la base de datos
                const [user] = await Usuarios.findOrCreate({
                    where: { nombre: userName },
                });
                // Verificar si el usuario ya existe en la bd
                const existUserInChatRoom = await ChatRooms.findOne({
                    where: { id_usuario: user.id_usuario },
                });
                // Si el usuario ya existe en la bd, devolver resultados al cliente
                if (existUserInChatRoom) {
                    socket.emit("userCreated", { result: existUserInChatRoom });
                } else {
                    // Si el usuario no existe en la bd, crear un nuevo usuario
                    const createdChatRoom = await ChatRooms.create({
                        id_usuario: user.id_usuario,
                        nombre_sala: userName,
                    });
                    socket.emit("userCreated", { result: createdChatRoom });
                    // Buscar el usuario creado en la bd
                    const userCreated = await ChatRooms.findOne({
                        where: { id_chat: createdChatRoom.id_chat },
                    });
                    // Notificar a los asesores sobre el nuevo usuario
                    io.emit("newUser", { Chats: userCreated });
                    
                }
            } catch (e) {
                console.log(e);
            }
        });


        // Mostrar lista de usuarios en espera
        socket.on("waitingRoom", async () => {
            try {
                const chatUsers = await ChatRooms.findAll();
                socket.emit("listUsers", {Chats:chatUsers});
            } catch (error) {
                console.log(error);
            }
        }
        );


		// Unir a la sala
		socket.on("joinRoom", async (roomID) => {
			socket.join(roomID);

			// cargar mensajes
			const id_chat = Number(roomID);
			await Mensajes.findAll({ where: { id_chat: id_chat } }).then(
				(mensajes) => {
					mensajes.forEach((mensaje) => {
						const datas = {
							id_mensaje: mensaje.id_mensaje.toString(),
							message: mensaje.mensaje,
							tipo_usuario: mensaje.tipo_usuario,
							hour: mensaje.hour,
						};
						socket.emit("receiveMessage", datas);
					});
				}
			);

             // Solo emitir "joinAsesor" si la sala no está en el set
            if (!roomsWithAsesor.has(roomID)) {
                socket.to(roomID).emit("joinAsesor", {msg: "Un asesor se ha unido a la sala"});
                // Añadir la sala al set para que no vuelva a emitir el mensaje
                roomsWithAsesor.add(roomID); 
            }
		});

		// Enviar mensaje a la sala
		socket.on("sendMessage", async (data: MessageData) => {
			try {
				const datas = {
					message: data.message,
					tipo_usuario: data.tipo_usuario,
					hour: data.hour,
				};
				const id_chat = Number(data.roomID);
				await Mensajes.create({
					id_chat: id_chat,
					mensaje: data.message,
					tipo_usuario: data.tipo_usuario,
					hour: data.hour,
				});

				socket
					.to(data.roomID)
					.emit("receiveMessage", datas);
			} catch (e) {
				console.log("Error al enviar mensaje:", e);
			}
		});
		// Salir de sala
		socket.on("exitChat", (roomID) => {
			socket.leave(roomID);
			console.log(`El asesor salió de la sala ${roomID}`);
		});

		// Desconectar
		socket.on("disconnect", () => {
			console.log(`Cliente desconectado`);
		});

		if (!socket.recovered) {
			try {
				socket.join(socket.handshake.auth.id_chat);

				const id_chat = Number(socket.handshake.auth.id_chat);
				const results = await Mensajes.findAll({
					where: {
						[Op.and]: [
							{ id_chat: id_chat },
							{
								id_chat: {
									[Op.gt]:
										socket.handshake.auth.ServerOffSet ?? 0,
								},
							},
						],
					},
				});
				results.forEach(async (result) => {
					socket.emit("receiveMessage", {
						message: result.mensaje,
						id_mensaje: result.id_mensaje,
						tipo_usuario: result.tipo_usuario,
                        hour: result.hour,
					});
				});
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
		const [user] = await Usuarios.findOrCreate({
			where: { nombre: userName },
		});

		const existUserInChatRoom = await ChatRooms.findOne({
			where: { id_usuario: user.id_usuario },
		});
		if (existUserInChatRoom) {
			return res.status(200).json({ result: existUserInChatRoom });
		} else {
			const createdChatRoom = await ChatRooms.create({
				id_usuario: user.id_usuario,
				nombre_sala: userName,
			});
			return res.status(200).json({ result: createdChatRoom });
		}
	} catch (e) {
		res.status(500).json({ msg: "Error interno del servidor" });
	}
};
