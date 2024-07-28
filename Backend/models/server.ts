import express, { Application } from 'express';
import cors from 'cors';
import http, { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import routesChat from '../routes/chat';

interface JoinData {
    room: string;
}

interface MessageData {
    room: string;
    user: string;
    message: string;
}

class ServerApp {
    private app: Application;
    private port: string;
	private server: http.Server;
    private io: Server;
	private apiPaths = {
		chat:"/api/chat",
	};

    constructor() {
        this.app = express();
        this.port = process.env.PORT || "3333";
		this.server = createServer(this.app);
		this.io = new Server(this.server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"]
			}
		});
        this.middlewares();
		this.routes();
		this.socketIO();
		
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static("public"));
    }

	socketIO() {
        this.io.on("connection", (socket: Socket) => {
            //Crear sala para cada usuario con su propio id
            socket.emit('connected', socket.id);
            console.log(`Client ${socket.id} joined room`);
            
            //Un asesor se une a la sala de un cliente
            socket.on('joinRoom', (roomName) => {
                socket.join(roomName);
                console.log(`Asesor ${socket.id} unido a la sala: ${roomName}`);
                this.io.to(roomName).emit('notification', `Asesor ${socket.id} se ha unido a la sala.`);
            });
            //Enviar mensaje a la sala
            socket.on('sendMessage', (roomName, message) => {
                this.io.to(roomName).emit('receiveMessage', { sender: socket.id, message });
                console.log(`Mensaje enviado por ${socket.id} en la sala ${roomName}: ${message}`);
            });

            //Listar salas y clientes conectados
                /* const roomsMap = this.io.of("/").adapter.rooms;
                roomsMap.forEach((clients, room) => {
                    const clientsArray = Array.from(clients);
                    console.log(`Sala: ${room}, Clientes: ${clientsArray}`);
                    
                }); */
            
            //Desconectar cliente o asesor
            socket.on("disconnect", () => {
                console.log("Client disconnected: " + socket.id);
            });

        });
    }

	routes(){
		this.app.use(this.apiPaths.chat, routesChat);
	}

    listen() {
        this.server.listen(this.port, () => {
            console.log("Servidor en el puerto: " + this.port);
        });
    }
}

export default ServerApp;
