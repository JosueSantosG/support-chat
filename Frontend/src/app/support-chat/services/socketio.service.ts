import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { env } from '../../../environments/environments';

@Injectable({
    providedIn: 'root',
})
export class SocketioService {
    public auth: {
        userName: string | null;
        id_chat: string | null;
        ServerOffSet: number;
    } = {
        userName: this.getUserName(),
        id_chat: this.getIdChat(),
        ServerOffSet: 0,
    };

    public io = io(env.url, { auth: this.auth });

    constructor() {}

    getUserName(): string | null {
        return sessionStorage.getItem('userName');
    }

    getIdChat(): string | null {
        return sessionStorage.getItem('id_chat');
    }
}
