import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { env } from '../../../environments/environments';
import { SocketioService } from './socketio.service';
@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(private http: HttpClient, private socket: SocketioService) {
    }



    setUserName(userName: string) {
        sessionStorage.setItem('userName', userName);
    }

    getUserName(): string | null {
        return sessionStorage.getItem('userName');
    }
}
