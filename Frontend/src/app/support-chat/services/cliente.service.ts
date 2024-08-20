import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../environments/environments';
import { SocketioService } from './socketio.service';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    myUrl: string;
    // Signal que mantendrá los datos de los clientes
    public userName = signal<string>('');

    constructor(private http: HttpClient, private socket: SocketioService) {
        this.myUrl = env.url;
    }

    //Obtener nombre de usuario
    getUserName(): Observable<string> {
        return new Observable((observer) => {
            observer.next(sessionStorage.getItem('userName')!);
            observer.complete();
        });
    }

    //Crear usuario
    createUser(userName: string): Observable<any> {
        return new Observable((observer) => {
            this.socket.io.emit('createUser', userName);
            this.socket.io.on('userCreated', (data: any) => {
                observer.next(data);
            });
        });
    }

    //Entrar a una sala
    joinRoom(roomID: string) {
        this.socket.io.emit('joinRoom', roomID);
        
    }

    //Enviar mensaje
    sendMessage(data: {
        roomID: string;
        message: string;
        tipo_usuario: string;
        hour: string;
    }): void {
        this.socket.io.emit('sendMessage', {
            ...data,
            ServerOffSet: this.socket.auth.ServerOffSet,
            userName: this.socket.auth.userName,
            id_chat: this.socket.auth.id_chat,
        });
    }

    //Recibir mensaje
    receiveMessage(): Observable<{ message: string; tipo_usuario: string; hour: string }> {
        return new Observable((observer) => {
            this.socket.io.on(
                'receiveMessage',
                (
                    datas: { message: string; tipo_usuario: string, hour: string },
                    ServerOffSet: number,
                    userName: string,
                    id_chat: string,
                ) => {
                    observer.next(datas);
                    this.socket.auth.ServerOffSet = ServerOffSet;
                    this.socket.auth.userName = userName;
                    this.socket.auth.id_chat = id_chat;
                }
            );
        });
    }
}
