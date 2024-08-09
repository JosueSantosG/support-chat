import { Component, inject, OnInit } from '@angular/core';
import { Chats } from './../../../models/Chats';
import { AsesorService } from './../../../services/asesor.service';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.css'
})
export class WaitingRoomComponent implements OnInit {
  constructor() { }
  
  //Signal del servicio envés del constructor
  private asesorService = inject(AsesorService);
  
  clientes = this.asesorService.clientes;
  
  ngOnInit(): void {
    this.asesorService.getClientes();
  }

  selectCliente(roomID: number, nameUser: string): void{
    alert(`${roomID}, ${nameUser}`);
  }

}
