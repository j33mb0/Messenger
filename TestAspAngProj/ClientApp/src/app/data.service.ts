import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Chat } from './chatlist/chatlist.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Message } from './chatview/chatview.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://localhost:7287/api/Data';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserData(): Observable<any> {
    const userId = this.authService.getUserId();

    if(userId) {
      return this.http.get<any>(`${this.apiUrl}/getuser/${userId}`);
    } else {
      return new Observable();
    }

  }

  searchUsersByNickname(nickname: string): Observable<any[]> {
    const userid = this.authService.getUserId();
    const requestData = {
      nickname : nickname,
      userid : userid
    }

    return this.http.post<any[]>(`${this.apiUrl}/SearchUsers`, requestData);
  }

  getChats(): Observable<Chat[]> {
    const userId = this.authService.getUserId();
    if(userId) {
      return this.http.get<Chat[]>(`${this.apiUrl}/GetChats/${userId}`);
    }
    else {
      return new Observable();
    }
  }

  getMessages(chatId: string | undefined): Observable<Message[]> {
    if(chatId != undefined) {
      return this.http.get<Message[]>(`${this.apiUrl}/GetMessages/${chatId}`);
    }
    return new Observable();
  }

  createChat(secondUserId: number): Observable<any> {
    const userId = this.authService.getUserId();
    const requestData = {
      userId : userId,
      secondUserId : secondUserId
    }
    return this.http.post<any>(`${this.apiUrl}/CreateChat`, requestData).pipe(
      catchError(error => {
        console.error('Error creating chat:', error);
        return throwError(error);
      })
    );;
  }

  sendMessage(chatId: string | undefined, message: string): Observable<any> {
    const userId = this.authService.getUserId();
    const requestData = {
      chatId : chatId,
      userId : userId,
      message : message
    }
    return this.http.post<any>(`${this.apiUrl}/SendMessage`, requestData).pipe(
      catchError(error => {
        console.error('Error send message', error);
        return throwError(error);
      })
    )
  }

  changeNickname(nickname: string): Observable<any> {
    const userId = this.authService.getUserId();
    const requestData = {
      userId : userId,
      nickname : nickname
    }
    return this.http.post<any>(`${this.apiUrl}/ChangeNickname`, requestData).pipe(
      catchError(error => {
        console.error('Changenickname error');
        return throwError(error);
      })
    )
  }

  changeUserImg(imgUrl: string): Observable<any> {
    const userId = this.authService.getUserId();
    const requestData = {
      userId : userId,
      imgUrl : imgUrl
    }
    return this.http.post<any>(`${this.apiUrl}/ChangeUserImg`, requestData).pipe(
      catchError(error => {
        console.error('Changeuserimg error');
        return throwError(error);
      })
    )
  }
}
