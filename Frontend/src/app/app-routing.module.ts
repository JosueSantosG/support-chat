import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './support-chat/pages/main/main.component';
import { WaitingRoomComponent } from './support-chat/components/asesor/waiting-room/waiting-room.component';


const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./support-chat/support-chat.module').then( m => m.SupportChatModule)
  },
  {
    path: 'login', component: MainComponent
  },
  {
		path: 'waiting-room', component: WaitingRoomComponent
	},
  {
    path: '**',
    redirectTo: 'welcome' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
