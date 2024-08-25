import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ViewChatComponent } from './components/cliente/view-chat/view-chat.component';
import { LoginComponent } from './components/asesor/login/login.component';
import { WaitingRoomComponent } from './components/asesor/waiting-room/waiting-room.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './pages/main/main.component';

import { SupportChatRoutingModule } from './support-chat-routing.module';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ViewClienteComponent } from './pages/view-cliente/view-cliente.component';
import { ViewAsesorComponent } from './pages/view-asesor/view-asesor.component';
import { ViewLoginComponent } from './pages/view-login/view-login.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    ViewChatComponent,
    MainComponent,
    LoginComponent,
    WaitingRoomComponent,
    HeaderComponent,
    ThemeToggleComponent,
    ViewClienteComponent,
    ViewAsesorComponent,
    ViewLoginComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SupportChatRoutingModule,

  ],
  exports: [
    ViewChatComponent,
    MainComponent,
    LoginComponent,
    WaitingRoomComponent,
    HeaderComponent,
    ThemeToggleComponent,
    ViewClienteComponent,
    ViewAsesorComponent,
    ViewLoginComponent,
    SpinnerComponent
    
  ]
})
export class SupportChatModule { }
