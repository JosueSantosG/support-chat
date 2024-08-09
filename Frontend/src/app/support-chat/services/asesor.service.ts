import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../environments/environments';
import { Chats } from '../models/Chats';

@Injectable({
  providedIn: 'root'
})
export class AsesorService {
  private myUrl : string;
  // Signal que mantendrá los datos de los clientes
  public clientes = signal<Chats[]>([]);


  constructor(private http: HttpClient) {
    this.myUrl = env.url;
  }

  //Obtener lista de usuarios
  getClientes(): void{
    this.http.get<{ Chats: Chats[] }>(`${this.myUrl}/api/chat/listUsers`)
    .subscribe((response) => {
      this.clientes.set(response.Chats);
    });
  }



}
