import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { SignalRService } from '../signal-r.service';
import { ChatService } from '../chat.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit {
  chats:Chat[] = [];
  selectedChat: Chat | null = null;
  searchForm: FormGroup;
  searchResults: any[] = [];

  chatblockheight: number = 85;
  addpanelheight: number = 6;
  isAddPanelOpen: boolean = false;

  isChatCreateErrorMsgVisible: boolean = false;
  ChatCreateErrorMsg: string = '';

  userDefaultImg = 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png';

  constructor(private fb: FormBuilder, private dataService: DataService, private signalrService: SignalRService, private chatService: ChatService) {
    this.searchForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadChats();
    this.signalrService.messageUpdate$.subscribe((message) => {
      this.loadChats();
    });
    this.signalrService.chatUpdate$.subscribe((message) => {
      this.loadChats();
    });
  }
  

  loadChats() {
    this.dataService.getChats().subscribe(
      (result) => { 
        this.chats = result.map(chat => ({
          chatId: chat.chatId,
          otherUserImg: chat.otherUserImg,
          otherUserName: chat.otherUserName,
          lastMessage: chat.lastMessage,
          lastMessageDate: chat.lastMessageDate
        }))
      },
      (error) => {
        console.log('dataservice.getchats error');
      }
    );
  }


  openAddPanel() {
    this.isAddPanelOpen = true;
    this.chatblockheight = 50;
    this.addpanelheight = 41;
  }

  closeAddPanel() {
    this.isAddPanelOpen = false;
    this.chatblockheight = 85;
    this.addpanelheight = 6;
  }

  searchUsers() {
    const username = this.searchForm.get('username')?.value;

    if(username) {
      this.dataService.searchUsersByNickname(username).subscribe(
      (results) => {
        this.searchResults = results;
      },
      (error) => {

      }
      );
    }
  }

  createChat(userid: number) {
    this.dataService.createChat(userid).subscribe(
      (result) => {
        this.loadChats();
        console.log('createChatincomponent');
      },
      (error) => {
        console.log(error.error);
        this.isChatCreateErrorMsgVisible = true;
        this.ChatCreateErrorMsg = error.error;
      }
      );
  }

  onChatClick(chat: Chat): void {
    this.selectedChat = chat;
    this.chatService.setSelectedChat(chat);
  }

  

}

export class Chat {
  chatId: string = '';
  otherUserName: string = '';
  lastMessage: string = '';
  otherUserImg: string = '';
  lastMessageDate: string  = '';
}

