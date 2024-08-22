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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const index_1 = __importDefault(require("../routes/index"));
const connection_1 = __importDefault(require("../database/connection"));
const chat_1 = require("../controllers/chat");
class ServerApp {
    constructor() {
        this.apiPaths = {
            chat: "/api/chat",
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "3333";
        this.server = (0, http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            },
            connectionStateRecovery: {}
        });
        this.dbConnection();
        this.middlewares();
        this.routes();
        this.socketIO();
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('Base de datos conectada...');
            }
            catch (error) {
                console.error('Error al autenticar con la base de datos:', error);
            }
        });
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static("public"));
    }
    socketIO() {
        (0, chat_1.socketHandler)(this.io);
    }
    routes() {
        this.app.use(this.apiPaths.chat, index_1.default);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log("Servidor en el puerto: " + this.port);
        });
    }
}
exports.default = ServerApp;
//# sourceMappingURL=server.js.map