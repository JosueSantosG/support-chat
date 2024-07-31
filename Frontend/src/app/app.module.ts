import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SupportChatModule } from "./support-chat/support-chat.module";

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SupportChatModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
