import { Component, effect, inject, signal } from '@angular/core';
import { AsesorService } from './../../../services/asesor.service';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrl: './waiting-room.component.css',
})
export class WaitingRoomComponent {
    isLoading: boolean = false;

    constructor() {
        this.getUsers();
    }

    //Signal del servicio envés del constructor
    private asesorService = inject(AsesorService);
    selectedRoom = signal<number | null>(null); // Señal para la sala de chat seleccionada
    isCollapsed = this.asesorService.isCollapsed;
    changeUser = this.asesorService.nameUser;

    clientes = this.asesorService.clientes;
    nameUser: string = '';

    //Método para colapsar la barra lateral
    toggleSidebar() {
        this.isCollapsed.set(!this.isCollapsed());
    }

    //Si el asesor selecciona un cliente, se unirá a la sala de chat
    selectCliente(roomID: number, nameUser: string): void {
        this.isCollapsed.set(false);
        this.changeUser.set(nameUser);
        sessionStorage.setItem('userName', nameUser);
        const previousRoom = this.selectedRoom(); // Obtiene el valor actual de la señal
        //Pero si el asesor selecciona a otro cliente:
        if (previousRoom !== roomID) {
            // Si el usuario seleccionado es diferente al actual
            if (previousRoom !== null) {
                // 1) Salir del chat del usuario actual
                this.exitChat(previousRoom);
            }

            // 2) Reiniciar el chat
            this.asesorService.resetChat();

            // 3) Unirse al chat del nuevo usuario
            this.selectedRoom.set(roomID); // Actualiza la señal con el nuevo roomID
            sessionStorage.setItem('id_chat', roomID.toString());
            this.asesorService.joinRoom(roomID);
        }
    }

    //Salir del chat del usuario
    exitChat(roomID: number): void {
        this.asesorService.exitChat(roomID);
    }

    private getUsers() {
        this.isLoading = true;
        effect(() => {
            this.asesorService.getClientes().subscribe((data) => {
                this.clientes.set(data.Chats);
                this.isLoading = false
            });
        });
    }
}
