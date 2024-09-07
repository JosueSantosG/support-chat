"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.socketHandler = void 0;
const sequelize_1 = require("sequelize");
const chatRooms_1 = __importDefault(require("../models/chatRooms"));
const mensajes_1 = __importDefault(require("../models/mensajes"));
const usuarios_1 = __importDefault(require("../models/usuarios"));
const connection_1 = __importDefault(require("../database/connection"));
var cron = require("node-cron");
const socketHandler = (io) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // Set para almacenar las salas que ya han tenido un asesor unido
        const roomsWithAsesor = new Set();
        // Mostrar lista de usuarios en espera
        socket.on("waitingRoom", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Obtener los mensajes más recientes de cada sala
                const chatUsers = yield mensajes_1.default.findAll({
                    include: [
                        {
                            model: chatRooms_1.default,
                            attributes: ["id_chat", "nombre_sala", "estado"],
                        },
                    ],
                    attributes: ["mensaje", "hour"],
                    where: {
                        id_mensaje: {
                            [sequelize_1.Op.in]: (0, sequelize_1.literal)(`
								(SELECT MAX(id_mensaje) FROM mensajes GROUP BY id_chat)
						`),
                        },
                    },
                    order: [["id_chat", "ASC"]], // Orden por id_chat
                });
                socket.emit("listUsers", { Chats: chatUsers });
            }
            catch (error) {
                console.log(error);
            }
        }));
        // Unir a la sala
        socket.on("joinRoom", (roomID) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(roomID);
            // cargar mensajes
            const id_chat = Number(roomID);
            yield mensajes_1.default.findAll({ where: { id_chat: id_chat } }).then((mensajes) => {
                mensajes.forEach((mensaje) => {
                    const datas = {
                        id_mensaje: mensaje.id_mensaje.toString(),
                        message: mensaje.mensaje,
                        tipo_usuario: mensaje.tipo_usuario,
                        hour: mensaje.hour,
                    };
                    socket.emit("receiveMessage", datas);
                });
            });
            // Solo emitir "joinAsesor" si la sala no está en el set
            if (!roomsWithAsesor.has(roomID)) {
                socket.to(roomID).emit("joinAsesor", {
                    msg: "Un asesor se ha unido a la sala",
                });
                // Añadir la sala al set para que no vuelva a emitir el mensaje
                roomsWithAsesor.add(roomID);
            }
        }));
        // Enviar mensaje a la sala
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const datas = {
                    id_chat: data.idchat,
                    id_usuario: data.id_usuario,
                    nombre_sala: data.nombre_sala,
                    message: data.message,
                    tipo_usuario: data.tipo_usuario,
                    hour: data.hour,
                };
                const findUser = yield chatRooms_1.default.findOne({
                    where: {
                        [sequelize_1.Op.or]: [
                            { id_usuario: datas.id_usuario },
                            { id_chat: datas.id_chat },
                        ],
                    },
                });
                // Si existe el usuario se guardan los mensajes
                if (findUser) {
                    const id_chat = findUser.id_chat;
                    yield mensajes_1.default.create({
                        id_chat: id_chat,
                        mensaje: data.message,
                        tipo_usuario: data.tipo_usuario,
                        hour: data.hour,
                    });
                    socket.to(id_chat.toString()).emit("receiveMessage", datas);
                }
                else {
                    // Si no existe se crea una sala de chat para el usuario
                    const createdChatRoom = yield chatRooms_1.default.create({
                        id_usuario: datas.id_usuario,
                        nombre_sala: datas.nombre_sala,
                    });
                    const id_chat = createdChatRoom.id_chat;
                    socket.join(id_chat.toString());
                    socket.emit("roomID", id_chat.toString());
                    yield mensajes_1.default.create({
                        id_chat: id_chat,
                        mensaje: data.message,
                        tipo_usuario: data.tipo_usuario,
                        hour: data.hour,
                    });
                    const userCreated = yield mensajes_1.default.findOne({
                        include: [
                            {
                                model: chatRooms_1.default,
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
            }
            catch (e) {
                console.log("Error al enviar mensaje:", e);
            }
        }));
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
                const results = yield mensajes_1.default.findAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            { id_chat: id_chat },
                            {
                                id_chat: {
                                    [sequelize_1.Op.gt]: (_a = socket.handshake.auth.ServerOffSet) !== null && _a !== void 0 ? _a : 0,
                                },
                            },
                        ],
                    },
                });
                results.forEach((result) => __awaiter(void 0, void 0, void 0, function* () {
                    socket.emit("receiveMessage", {
                        message: result.mensaje,
                        id_mensaje: result.id_mensaje,
                        tipo_usuario: result.tipo_usuario,
                        hour: result.hour,
                    });
                }));
            }
            catch (e) {
                console.log(e);
            }
        }
    }));
};
exports.socketHandler = socketHandler;
// Crear usuario
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Guardar en la bd el nombre del usuario y devolver el id de la sala de chat
    try {
        const { userName } = req.body;
        const createdUser = yield usuarios_1.default.create({
            nombre: userName,
        });
        return res.status(200).json({ result: createdUser });
    }
    catch (e) {
        res.status(500).json({ msg: "Error interno del servidor" });
    }
});
exports.createUser = createUser;
// Función para borrar todos los datos de la BD
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Desactivar verificación de claves foráneas
            yield connection_1.default.query("SET FOREIGN_KEY_CHECKS = 0;", { raw: true });
            yield usuarios_1.default.destroy({ truncate: true });
            yield chatRooms_1.default.destroy({ truncate: true });
            yield mensajes_1.default.destroy({ truncate: true });
            // Reactivar verificación de claves foráneas
            yield connection_1.default.query("SET FOREIGN_KEY_CHECKS = 1;", { raw: true });
            console.log("Datos eliminados correctamente.");
        }
        catch (error) {
            console.error("Error al eliminar los datos:", error);
        }
    });
}
// Se ejecutará todos los días a las 00:00
cron.schedule("0 0 * * *", () => {
    console.log("Ejecutando limpieza diaria de datos...");
    deleteAllData();
});
//# sourceMappingURL=chat.js.map