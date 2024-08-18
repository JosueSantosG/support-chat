import { Component, inject, OnInit, signal } from '@angular/core';
import { Chats } from './../../../models/Chats';
import { AsesorService } from './../../../services/asesor.service';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.css'
})
export class WaitingRoomComponent implements OnInit {

  constructor(private clienteService: ClienteService) { }
  
  //Signal del servicio envés del constructor
  private asesorService = inject(AsesorService);
  selectedRoom = signal<number | null>(null); // Señal para la sala de chat seleccionada

  clientes = this.asesorService.clientes;
  //resetChat = this.asesorService.resetValue;

  
  ngOnInit(): void {
    this.asesorService.getClientes();
  }

/*   selectCliente(roomID: number): void {
    //TODO:
    //Si el asesor selecciona un cliente, se unirá a la sala de chat
    sessionStorage.setItem('id_chat', roomID.toString());
    const id_chat = sessionStorage.getItem('id_chat');
    this.asesorService.joinRoom(parseInt(id_chat!));
    //TODO: Pero si el asesor selecciona a otro cliente: 
    //1) Salir del chat del usuario actual
    //2) Reiniciar el chat 
    //3) Unirse al chat del nuevo usuario
  } */
    selectCliente(roomID: number): void {
      const previousRoom = this.selectedRoom(); // Obtiene el valor actual de la señal
  
      if (previousRoom !== roomID) { // Si se selecciona una sala diferente
        if (previousRoom !== null) {
          // 1) Salir del chat del usuario actual
          this.exitChat(previousRoom);
        }
  
        // 2) Reiniciar el chat (puedes agregar lógica adicional si es necesario)
        this.asesorService.resetChat();
  
        // 3) Unirse al chat del nuevo usuario
        this.selectedRoom.set(roomID); // Actualiza la señal con el nuevo roomID
        console.log(this.selectedRoom());
        
        sessionStorage.setItem('id_chat', roomID.toString());
        this.asesorService.joinRoom(roomID);
      }
    }
  
  //Salir del chat del usuario
  exitChat(roomID: number): void {
    this.asesorService.exitChat(roomID);
  }

  

}
