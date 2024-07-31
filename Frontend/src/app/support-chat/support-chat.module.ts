import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ViewChatComponent } from './components/cliente/view-chat/view-chat.component';
import { LoginComponent } from './components/asesor/login/login.component';
import { WaitingRoomComponent } from './components/asesor/waiting-room/waiting-room.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './pages/main/main.component';

import { SupportChatRoutingModule } from './support-chat-routing.module';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

@NgModule({
  declarations: [
    ViewChatComponent,
    MainComponent,
    LoginComponent,
    WaitingRoomComponent,
    HeaderComponent,
    ThemeToggleComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SupportChatRoutingModule
  ],
  exports: [
    ViewChatComponent,
    MainComponent,
    LoginComponent,
    WaitingRoomComponent,
    HeaderComponent,
    
  ]
})
export class SupportChatModule { }
