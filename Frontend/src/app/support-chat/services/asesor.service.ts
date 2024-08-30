import { HttpClient } from '@angular/common/http';
import { effect, Injectable, Signal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../environments/environments';
//import { Chats } from '../models/Chats';
import { SocketioService } from './socketio.service';
import { ClienteService } from './cliente.service';
import { Chats, ChatxMens} from '../models/Chats'; // Ajustamos los tipos de datos


@Injectable({
  providedIn: 'root'
})
export class AsesorService {
  private myUrl : string;
  // Signal que mantendrá los datos de los clientes
  public clientes = signal<ChatxMens[]>([]);
  // Signal para enviar valor true o false
  public value = signal<boolean>(false);
  // Signal para reiniciar el chat
  public resetChatSignal = signal<boolean>(false);
  // Signal para el estado del sidebar
  public isCollapsed = signal<boolean>(false); 
  // Signal para el cambio de nombre de usuario
  public nameUser = signal<string>('Annonymous');
  // Signal para el mensaje del asesor
  public msgAsesor = signal<string>('');


  
  constructor(private http: HttpClient, private socket: SocketioService, private clienteService:ClienteService) {
    this.myUrl = env.url;
  }

  //Obtener lista de usuarios
  getClientes(): Observable<ChatxMens[]> {
    return new Observable((observer) => {
      this.socket.io.emit('waitingRoom');
          // Escucha los usuarios existentes
    this.socket.io.on('listUsers', (data: { Chats: Chats[] }) => {
      const usersMapped = data.Chats.map(chat => ChatxMens.chatxMens(chat));
      // Se envía los datos mapeados
      observer.next(usersMapped); 
    });
      // Escuchar el nuevo usuario para actualizar la lista
      this.socket.io.on('newUser', (data: { Chats: Chats }) => {
        // Se crea la instancia de ChatxMens para el nuevo usuario
        const newUser = ChatxMens.chatxMens(data.Chats);
        // Se actualiza la lista de clientes agregando el nuevo usuario
        this.clientes.set([...this.clientes(), newUser]);
        console.log(newUser);
      });
    });
  }

  // Cambiar el valor de value a true
  joinRoom(roomID: number): void{
    this.value.set(true);
    this.resetChatSignal.set(true);
    this.clienteService.joinRoom(roomID.toString());
  }

  //Enviar mensaje de asesor se ha unido
  joinAsesor(): Observable<{msg: string}>{
    return new Observable((observer) => {
      this.socket.io.on('joinAsesor', (data: {msg: string}) => {
        observer.next(data);
        this.msgAsesor.set(data.msg);
      });
    });
  }

  // Salir del chat del usuario
  exitChat(roomID: number): void{
    this.socket.io.emit('exitChat', roomID.toString());
    
  }

  // Reiniciar el chat
  resetChat(): void {
    this.resetChatSignal.set(true);
  }

  // Método para colapsar la barra lateral
  sideBar(): void{
    this.isCollapsed.set(!this.isCollapsed());
  }

  // Cambiar el nombre del usuario
  changeUsername(name: string): void{
    //sessionStorage.getItem('userName');
    this.nameUser.set(name);
  }


}
