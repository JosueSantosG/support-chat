import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportChatRoutingModule } from './support-chat-routing.module';
import { ViewChatComponent } from './components/view-chat/view-chat.component';
import { MainComponent } from './pages/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/asesor/login/login.component';
import { WaitingRoomComponent } from './components/asesor/waiting-room/waiting-room.component';


@NgModule({
  declarations: [
    ViewChatComponent,
    MainComponent,
    LoginComponent,
    WaitingRoomComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SupportChatRoutingModule
  ]
})
export class SupportChatModule { }
