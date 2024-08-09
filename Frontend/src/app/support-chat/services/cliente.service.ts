import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../environments/environments';
import { SocketioService } from './socketio.service';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    private myUrl: string;

    constructor(private http: HttpClient, private socket: SocketioService) {
        this.myUrl = env.url;
    }

    //Crear usuario
    createUser(userName: string): Observable<any> {
        return new Observable((observer) => {
            this.http
                .post<any>(`${this.myUrl}/api/chat/createUser`, { userName })
                .subscribe((response) => {
                    observer.next(response);
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
    }): void {
        this.socket.io.emit('sendMessage', data);
        console.log('Data:', data);
    }

    //Recibir mensaje
    receiveMessage(): Observable<{ message: string; tipo_usuario: string }> {
        return new Observable((observer) => {
            this.socket.io.on(
                'receiveMessage',
                (
                    datas: { message: string; tipo_usuario: string },
                    ServerOffSet: number
                ) => {
                    observer.next(datas);
                    this.socket.auth.ServerOffSet = ServerOffSet;
                    console.log('Data:', datas);
                }
            );
        });
    }
}
