import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from './../../services/chat.service';

@Component({
  selector: 'app-view-chat',
  templateUrl: './view-chat.component.html',
  styleUrl: './view-chat.component.css'
})
export class ViewChatComponent implements OnInit {

  room: string = '';
  user: string = '';
  message: string = '';
  nameUser: string = '';
  messages: { user: string, message: string }[] = [];

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    /* this.chatService.getMessage().subscribe((data) => {
      this.messages.push(data);
    }); */

/*     this.chatService.getMessage()
      .subscribe((data: { user: string, room: string, message: string }) => {
        // this.messageArray.push(data);
        if (this.roomId) {
          setTimeout(() => {
            this.storageArray = this.chatService.getStorage();
            const storeIndex = this.storageArray
              .findIndex((storage) => storage.roomId === this.roomId);
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500);
        }
      }); */

  }

  //Lógica para el chat
  /* 
  Se carga la pagina y se verifica 
  
  */

  joinRoom() {
    this.chatService.joinRoom(this.room);
  }

  sendMessage() {
    const mensaje = {
      user: this.user,
      room: this.room,
      message: this.message
    };

    this.chatService.sendMessage(mensaje);
    this.message = '';
  }

  /* ngAfterViewInit(): void {
    this.openPopup(this.popup);
  }

  openPopup(content: any): void {
    this.modalService.open(content, {backdrop: 'static', centered: true});
  } 

  login(dismiss: any): void {
    this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
    this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());

    if (this.currentUser) {
      this.showScreen = true;
      dismiss();
    }
  }

  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find(user => user.phone === phone)?.name || '';
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({user: username, room: roomId});
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    });

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };

      this.storageArray.push(updateStorage);
    }

    this.chatService.setStorage(this.storageArray);
    this.messageText = '';
  }
*/


}
