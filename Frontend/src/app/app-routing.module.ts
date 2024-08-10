import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewLoginComponent } from './support-chat/pages/view-login/view-login.component';
import { ViewAsesorComponent } from './support-chat/pages/view-asesor/view-asesor.component';


const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./support-chat/support-chat.module').then( m => m.SupportChatModule)
  },
  {
    path: 'login', component: ViewLoginComponent
  },
  {
		path: 'waiting-room', component: ViewAsesorComponent
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
