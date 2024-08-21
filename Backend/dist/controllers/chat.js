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
const socketHandler = (io) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // Set para almacenar las salas que ya han tenido un asesor unido
        const roomsWithAsesor = new Set();
        // Crear usuario
        socket.on("createUser", (userName) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Insertar usuario en la base de datos
                const user = yield usuarios_1.default.create({
                    nombre: userName,
                });
                // Se crea una sala de chat para el usuario
                const createdChatRoom = yield chatRooms_1.default.create({
                    id_usuario: user.id_usuario,
                    nombre_sala: userName,
                });
                socket.emit("userCreated", { result: createdChatRoom });
                // Buscar el usuario creado en la bd
                const userCreated = yield chatRooms_1.default.findOne({
                    where: { id_chat: createdChatRoom.id_chat },
                });
                // Notificar a los asesores sobre el nuevo usuario
                io.emit("newUser", { Chats: userCreated });
            }
            catch (e) {
                console.log(e);
            }
        }));
        // Mostrar lista de usuarios en espera
        socket.on("waitingRoom", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chatUsers = yield chatRooms_1.default.findAll();
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
                socket.to(roomID).emit("joinAsesor", { msg: "Un asesor se ha unido a la sala" });
                // Añadir la sala al set para que no vuelva a emitir el mensaje
                roomsWithAsesor.add(roomID);
            }
        }));
        // Enviar mensaje a la sala
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const datas = {
                    message: data.message,
                    tipo_usuario: data.tipo_usuario,
                    hour: data.hour,
                };
                const id_chat = Number(data.roomID);
                yield mensajes_1.default.create({
                    id_chat: id_chat,
                    mensaje: data.message,
                    tipo_usuario: data.tipo_usuario,
                    hour: data.hour,
                });
                socket
                    .to(data.roomID)
                    .emit("receiveMessage", datas);
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
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Guardar en la bd el nombre del usuario y devolver el id de la sala de chat
    try {
        const { userName } = req.body;
        const [user] = yield usuarios_1.default.findOrCreate({
            where: { nombre: userName },
        });
        const existUserInChatRoom = yield chatRooms_1.default.findOne({
            where: { id_usuario: user.id_usuario },
        });
        if (existUserInChatRoom) {
            return res.status(200).json({ result: existUserInChatRoom });
        }
        else {
            const createdChatRoom = yield chatRooms_1.default.create({
                id_usuario: user.id_usuario,
                nombre_sala: userName,
            });
            return res.status(200).json({ result: createdChatRoom });
        }
    }
    catch (e) {
        res.status(500).json({ msg: "Error interno del servidor" });
    }
});
exports.createUser = createUser;
//# sourceMappingURL=chat.js.map