import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ViewChatComponent } from './components/view-chat/view-chat.component';

const routes: Routes = [
	{
		path: '', component: MainComponent,
		
	},
	{
		path: 'chat', component: ViewChatComponent
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
