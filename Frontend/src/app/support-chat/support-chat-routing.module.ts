import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ViewClienteComponent } from './pages/view-cliente/view-cliente.component';

import { myGuard } from '../guards/guard.guard';

const routes: Routes = [
	{
		path: '', component: MainComponent,
		
	},
	{
		path: 'chat', component: ViewClienteComponent , canActivate: [myGuard]
	},
	{
		path: '**', redirectTo: '/'
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class SupportChatRoutingModule { }
