import express, { Application } from 'express';
import cors from 'cors';
import http, { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import indexRoutes from '../routes/index';
import db from '../database/connection';
import { socketHandler } from '../controllers/chat';


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
			},
            connectionStateRecovery:{

            }
		});
        this.dbConnection();
        this.middlewares();
		this.routes();
        this.socketIO();
		
    }
    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Base de datos conectada...');
        } catch (error) {
            console.error('Error al autenticar con la base de datos:', error);
        }
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static("public"));
    }

    socketIO() {
        socketHandler(this.io);
    }

	routes(){
		this.app.use(this.apiPaths.chat, indexRoutes);
	}

    listen() {
        this.server.listen(this.port, () => {
            console.log("Servidor en el puerto: " + this.port);
        });
    }
}

export default ServerApp;
