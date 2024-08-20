import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ClienteService } from './../../services/cliente.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  nameUser: string = "";

  constructor(private clienteService: ClienteService, private router: Router ) { }
  ngOnInit(): void {
  }

  joinRoom() {
      sessionStorage.setItem('userName', this.nameUser);
      sessionStorage.setItem('typeUser', 'cliente');
      this.clienteService.createUser(this.nameUser).subscribe((response)=>{
        sessionStorage.setItem('id_chat', response.result.id_chat.toString());
        this.router.navigate(['/welcome/chat']);
        this.loadMsj();
      });
  }

  private loadMsj() {
    const idchat=sessionStorage.getItem('id_chat');
    if(idchat === null){
        return;
    }
    this.clienteService.joinRoom(idchat);    
}


}
