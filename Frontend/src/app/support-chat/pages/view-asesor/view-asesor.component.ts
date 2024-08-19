import { Component, effect, inject, OnInit } from '@angular/core';
import { AsesorService } from '../../services/asesor.service';

@Component({
  selector: 'app-view-asesor',
  templateUrl: './view-asesor.component.html',
  styleUrl: './view-asesor.component.css'
})
export class ViewAsesorComponent implements OnInit {
  //Signal del servicio envés del constructor
    private asesorService = inject(AsesorService);
    value = this.asesorService.value;
    isCollapsed = this.asesorService.isCollapsed;
    constructor(){
      effect(() => {
        this.asesorService.isCollapsed();
      });
    }


    ngOnInit():void{
      //console.log('valor del asesor:',this.isCollapsed());
      
        //this.asesorService.sideBar();
    } 

    


}
