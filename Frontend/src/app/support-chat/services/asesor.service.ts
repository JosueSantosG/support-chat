import { HttpClient } from '@angular/common/http';
import { effect, Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../environments/environments';
import { Chats } from '../models/Chats';
import { SocketioService } from './socketio.service';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root'
})
export class AsesorService {
  private myUrl : string;
  // Signal que mantendrá los datos de los clientes
  public clientes = signal<Chats[]>([]);
  // Signal para enviar valor true o false
  public value = signal<boolean>(false);
  // Signal para manejar el id del chat
  public resetChatSignal = signal<boolean>(false); // Señal para reiniciar el chat

  
  constructor(private http: HttpClient, private socket: SocketioService, private clienteService:ClienteService) {
    this.myUrl = env.url;
  }

  //Obtener lista de usuarios
  getClientes(): void{
    this.http.get<{ Chats: Chats[] }>(`${this.myUrl}/api/chat/listUsers`)
    .subscribe((response) => {
      this.clientes.set(response.Chats);
    });
  }
  //TODO: Crear función para obtener mensajes de un usuario
  getMensajes(id: string): Observable<any>{
    return this.http.get(`${this.myUrl}/api/chat/getMessages/${id}`);
  }

  // Cambiar el valor de value a true
  joinRoom(roomID: number): void{
    this.value.set(true);
    this.resetChatSignal.set(true);
    this.clienteService.joinRoom(roomID.toString());
  }

  // Salir del chat del usuario
  exitChat(roomID: number): void{
    this.socket.io.emit('exitChat', roomID.toString());
    
  }

  resetChat(): void {
    this.resetChatSignal.set(true); // Activa la señal de reinicio del chat
  }


}
