import { Request, Response } from "express";
import { Server } from "socket.io";
import { literal, Op } from "sequelize";
import ChatRooms from "../models/chatRooms";
import Mensajes from "../models/mensajes";
import Usuarios from "../models/usuarios";
import db from "../database/connection";
var cron = require("node-cron");

interface MessageData {
	idchat: number;
	id_usuario: number;
	nombre_sala: string;
	message: string;
	tipo_usuario: string;
	hour: string;
}

export const socketHandler = (io: Server) => {
	io.on("connection", async (socket) => {
		// Set para almacenar las salas que ya han tenido un asesor unido
		const roomsWithAsesor = new Set();

		// Mostrar lista de usuarios en espera
		socket.on("waitingRoom", async () => {
			try {
				// Obtener los mensajes más recientes de cada sala
				const chatUsers = await Mensajes.findAll({
					include: [
						{
							model: ChatRooms,
							attributes: ["id_chat", "nombre_sala", "estado"],
						},
					],
					attributes: ["mensaje", "hour"],
					where: {
						id_mensaje: {
							[Op.in]: literal(`
								(SELECT MAX(id_mensaje) FROM mensajes GROUP BY id_chat)
						`),
						},
					},
					order: [["id_chat", "ASC"]], // Orden por id_chat
				});
				socket.emit("listUsers", { Chats: chatUsers });
			} catch (error) {
				console.log(error);
			}
		});

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
				socket.to(roomID).emit("joinAsesor", {
					msg: "Un asesor se ha unido a la sala",
				});
				// Añadir la sala al set para que no vuelva a emitir el mensaje
				roomsWithAsesor.add(roomID);
			}
		});

		// Enviar mensaje a la sala
		socket.on("sendMessage", async (data: MessageData) => {
			try {
				const datas = {
					id_chat: data.idchat,
					id_usuario: data.id_usuario,
					nombre_sala: data.nombre_sala,

					message: data.message,
					tipo_usuario: data.tipo_usuario,
					hour: data.hour,
				};

				const findUser = await ChatRooms.findOne({
					where: {
						[Op.or]: [
							{ id_usuario: datas.id_usuario },
							{ id_chat: datas.id_chat },
						],
					},
				});
				// Si existe el usuario se guardan los mensajes
				if (findUser) {
					const id_chat = findUser.id_chat;
					await Mensajes.create({
						id_chat: id_chat,
						mensaje: data.message,
						tipo_usuario: data.tipo_usuario,
						hour: data.hour,
					});

					socket.to(id_chat.toString()).emit("receiveMessage", datas);
				} else {
					// Si no existe se crea una sala de chat para el usuario
					const createdChatRoom = await ChatRooms.create({
						id_usuario: datas.id_usuario,
						nombre_sala: datas.nombre_sala,
					});
					const id_chat = createdChatRoom.id_chat;
					socket.join(id_chat.toString());
					socket.emit("roomID", id_chat.toString());
					await Mensajes.create({
						id_chat: id_chat,
						mensaje: data.message,
						tipo_usuario: data.tipo_usuario,
						hour: data.hour,
					});

					const userCreated = await Mensajes.findOne({
						include: [
							{
								model: ChatRooms,
								attributes: [
									"id_chat",
									"nombre_sala",
									"estado",
								],
								where: { id_chat: id_chat },
							},
						],
						attributes: ["mensaje", "hour"],
						order: [["id_mensaje", "DESC"]],
						limit: 1, // último mensaje
					});

					// Notificar a los asesores sobre el nuevo usuario
					io.emit("newUser", { Chats: userCreated });
				}
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

// Crear usuario
export const createUser = async (req: Request, res: Response) => {
	// Guardar en la bd el nombre del usuario y devolver el id de la sala de chat
	try {
		const { userName } = req.body;
		const createdUser = await Usuarios.create({
			nombre: userName,
		});
		return res.status(200).json({ result: createdUser });
	} catch (e) {
		res.status(500).json({ msg: "Error interno del servidor" });
	}
};

// Función para borrar todos los datos de la BD
async function deleteAllData() {
	try {
		// Desactivar verificación de claves foráneas
		await db.query("SET FOREIGN_KEY_CHECKS = 0;", { raw: true });
		await Usuarios.destroy({ truncate: true });
		await ChatRooms.destroy({ truncate: true });
		await Mensajes.destroy({ truncate: true });
		// Reactivar verificación de claves foráneas
		await db.query("SET FOREIGN_KEY_CHECKS = 1;", { raw: true });
		console.log("Datos eliminados correctamente.");
	} catch (error) {
		console.error("Error al eliminar los datos:", error);
	}
}

// Se ejecutará todos los días a las 00:00
cron.schedule("0 0 * * *", () => {
	console.log("Ejecutando limpieza diaria de datos...");
	deleteAllData();
});
