import {
    Component,
    effect,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';

import { Messages } from '../../../../interfaces/Messsages';
import { ClienteService } from './../../../services/cliente.service';
import { AsesorService } from '../../../services/asesor.service';

@Component({
    selector: 'app-view-chat',
    templateUrl: './view-chat.component.html',
    styleUrls: ['./view-chat.component.css'],
})
export class ViewChatComponent implements OnInit {
    @ViewChild('chatScroll') chatScrollContainer!: ElementRef;

    messages: Messages[] = [];
    nameUser: string = '';
    typeUser: string = sessionStorage.getItem('typeUser') || 'asesor';

    // Signal del servicio envés del constructor
    private asesorService = inject(AsesorService);
    constructor(private clienteService: ClienteService) {
        this.observeResetSignal();
    }

    ngOnInit(): void {
        this.nameUser = sessionStorage.getItem('userName')!;
        this.welcomeMsg();
        this.receiveMessages();
    }

    private observeResetSignal(): void {
        effect(
            () => {
                if (this.asesorService.resetChatSignal()) {
                    this.clearMessages();
                    this.asesorService.resetChatSignal.set(false); // Resetear la señal para futuros reinicios
                }
            },
            { allowSignalWrites: true }
        ); // Permite modificar señales dentro de este `effect`
    }

    private welcomeMsg() {
        this.messages.push({
            user: this.typeUser === 'cliente' ? 'asesor' : 'asesor',
            msg: 'Por favor escriba su consulta para agilizar el proceso mientras espera a que lo atienda un asesor, gracias por su comprensión 🤗',
        });
    }

    onSendButton() {
        const textField = document.querySelector('input');
        const text = textField!.value.trim();
        if (text === '') {
            return;
        }

        const sendMessage = { user: this.typeUser, msg: text };
        this.messages.push(sendMessage);
        this.scrollChat();

        // Enviar el mensaje a través de Socket.IO
        const id_chat: any = sessionStorage.getItem('id_chat');
        this.clienteService.sendMessage({
            roomID: id_chat,
            message: text,
            tipo_usuario: this.typeUser,
        });

        textField!.value = '';
    }

    private receiveMessages() {
        this.clienteService
            .receiveMessage()
            .subscribe((data: { message: string; tipo_usuario: string }) => {
                const receivedMessage = {
                    user: data.tipo_usuario,
                    msg: data.message,
                };
                this.messages.push(receivedMessage);
                this.scrollChat();
            });
    }

    private clearMessages() {
        this.messages = [];
    }

    // scroll al final del chat
    scrollChat() {
        setTimeout(() => {
            try {
                if (!this.chatScrollContainer?.nativeElement) {
                    //console.log('El contenedor de scroll no está definido.');
                    return;
                }
    
                const userMessages: Element[] = Array.from(
                    this.chatScrollContainer.nativeElement.getElementsByClassName(
                        'cliente'
                    )
                );
    
                if (userMessages.length > 0) {
                    userMessages[userMessages.length - 1].scrollIntoView();
                } else {
                    //console.log('No hay mensajes del cliente para desplazar.');
                }
            } catch (err) {
                console.error(
                    'Error al desplazar el scroll hacia el mensaje del usuario:',
                    err
                );
            }
        }, 0);
    }
        
}
