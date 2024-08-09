import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ViewChatComponent } from './components/cliente/view-chat/view-chat.component';
import { myGuard } from '../guards/guard.guard';

const routes: Routes = [
	{
		path: '', component: MainComponent,
		
	},
	{
		path: 'chat', component: ViewChatComponent, canActivate: [myGuard]
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
