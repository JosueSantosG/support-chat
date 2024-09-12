import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-cliente',
  templateUrl: './view-cliente.component.html',
  styleUrls: ['./view-cliente.component.css']
})
export class ViewClienteComponent implements OnInit {
  showNotification = false; // Inicialmente la notificación está oculta
  isHidden = true; // Controla la animación de entrada y salida
  

  ngOnInit() {
    // Retraso de 1 segundo antes de mostrar la notificación
    setTimeout(() => {
      this.showNotification = true; // Mostrar la notificación
      setTimeout(() => {
        this.isHidden = false; // Aplicar animación de entrada
      }, 50); // Retraso para permitir el renderizado antes de la animación
    }, 1000); // Retraso de 1 segundo
  }

  closeNotification() {
    this.isHidden = true; // Aplicar animación de salida
    setTimeout(() => {
      this.showNotification = false; // Ocultar la notificación después de la animación de cierre
    }, 500); // Duración de la animación de salida
  }
}
