import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Messages } from '../../../../interfaces/Messsages';
import { ClienteService } from './../../../services/cliente.service';

@Component({
    selector: 'app-view-chat',
    templateUrl: './view-chat.component.html',
    styleUrls: ['./view-chat.component.css'], // Corregir typo en 'styleUrl' a 'styleUrls'
})
export class ViewChatComponent implements OnInit {
    messages: Messages[] = [];
    nameUser: string = '';
    values: any;

    constructor(private clienteService: ClienteService) {}

    ngOnInit(): void {
        this.nameUser = sessionStorage.getItem('userName')!;
        //this.chatServices.createUser(this.nameUser);
        this.welcomeMsg();
        this.receiveMessages();
        this.joinRoom();
        
    }

    private welcomeMsg() {
        this.messages.push({
            user: 'asesor',
            msg: 'Por favor escriba su consulta para agilizar el proceso mientras espera a que lo atienda un asesor, gracias por su comprensión 🤗',
        });
    }

    onSendButton() {
        const textField = document.querySelector('input');
        const text = textField!.value.trim();
        if (text === '') {
            return;
        }

        const sendMessage = { user: 'cliente', msg: text};
        this.messages.push(sendMessage);

        // Enviar el mensaje a través de Socket.IO
        const id_chat:any = sessionStorage.getItem('id_chat');
        this.clienteService.sendMessage({ roomID: id_chat, message: text, tipo_usuario: 'cliente' });        
        textField!.value = '';
    }

    private receiveMessages() {
        this.clienteService.receiveMessage().subscribe((data: { message: string, tipo_usuario: string }) => {
            const receivedMessage = { user: data.tipo_usuario, msg: data.message };
            this.messages.push(receivedMessage);
            
        });
    }

    private joinRoom() {
        const idchat=sessionStorage.getItem('id_chat');
        if(idchat === null){
            return;
        }
        this.clienteService.joinRoom(idchat);
        console.log('idchat:', idchat);
    }

}
