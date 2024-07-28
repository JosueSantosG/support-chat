import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket:any;
  private url = 'http://localhost:3333';

  constructor() {
    /* this.socket = io(this.url, {transports: ['websocket', 'polling', 'flashsocket']}); */

  }

  joinRoom(room: string) {
    this.socket.emit('joinRoom', room);
  }

  sendMessage(message: { user: string, room: string, message: string }) {
    this.socket.emit('sendMessage', message);
  }

  getMessage(): Observable<{ user: string, message: string }> {
    return new Observable(observer => {
      this.socket.on('new message', (data:any) => {
        observer.next(data);
        console.log(data);
        
      });

      return () => {
        this.socket.disconnect();
      }
    });
  }

  getStorage() {
    const storage: string = localStorage.getItem('chats')!;
    return storage ? JSON.parse(storage) : [];
  }

  setStorage(data:any) {
    localStorage.setItem('chats', JSON.stringify(data));
  }
  
}
