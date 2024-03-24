import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  
  private chatUpdateSubject = new Subject<string>();
  chatUpdate$ = this.chatUpdateSubject.asObservable();

  private messageUpdateSubject = new Subject<any>();
  messageUpdate$ = this.messageUpdateSubject.asObservable();

  constructor(private authService: AuthService) {
    const userId = authService.getUserId();
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(`https://localhost:7287/chat?userId=${userId}`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();
    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection.start()
    .then(() => {
      console.log('SignalR connection started');
    })
    .catch((error) => {
      console.error('Error while starting SignalR connection:', error);
    })

    this.hubConnection.on('ReceiveChatUpdate', (message)=> {
      console.log('chatupdatereceived', message);
      this.chatUpdateSubject.next(message);
    });

    this.hubConnection.on('ReceiveMessage', (message) => {
      console.log('messageupdatereceived', message);
      this.messageUpdateSubject.next(message);
    })
  }

  
  
}
