import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { ChatviewComponent } from './chatview/chatview.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './AuthGuard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthRequestOptions } from './AuthRequestOptions';
import { AuthErrorHandler } from './AuthErrorHandler';
import { HeaderpageComponent } from './headerpage/headerpage.component';
import { ChatService } from './chat.service';


@NgModule({
  declarations: [
    AppComponent,
    ChatlistComponent,
    ChatviewComponent,
    HeaderpageComponent,
    LoginpageComponent,
    MainpageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    ChatService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthRequestOptions, multi: true},
    { provide: ErrorHandler, useClass: AuthErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
