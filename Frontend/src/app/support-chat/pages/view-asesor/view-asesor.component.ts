import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-asesor',
  templateUrl: './view-asesor.component.html',
  styleUrl: './view-asesor.component.css'
})
export class ViewAsesorComponent implements OnInit {
    value : boolean;    
    constructor(){
      this.value = false;
    }
    ngOnInit():void{
      this.value = false;
    } 


}
