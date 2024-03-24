import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat } from './chatlist/chatlist.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private selectedChatSubject: BehaviorSubject<Chat | null> = new BehaviorSubject<Chat | null>(null);
  $selectedChat: Observable<Chat | null> = this.selectedChatSubject.asObservable();

  setSelectedChat(chat: Chat) {
    this.selectedChatSubject.next(chat);
  }

  getSelectedChat() : Observable<Chat | null> {
    return this.$selectedChat;
  }
}