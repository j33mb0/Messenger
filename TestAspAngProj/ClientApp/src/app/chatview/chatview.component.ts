import { ChangeDetectorRef, Component, OnDestroy, OnInit, ElementRef, ViewChild} from '@angular/core';
import { ChatService } from '../chat.service';
import { Chat } from '../chatlist/chatlist.component';
import { DataService } from '../data.service';
import { Subscription, timeout } from 'rxjs';
import { AuthService } from '../auth.service';
import { SignalRService } from '../signal-r.service';

@Component({
  selector: 'app-chatview',
  templateUrl: './chatview.component.html',
  styleUrls: ['./chatview.component.css']
})
export class ChatviewComponent implements OnDestroy, OnInit {
  selectedChat: Chat | null = null;
  messages: Message[] = [];
  sendMessageText: string = '';
  private chatSubscription: Subscription;
  @ViewChild('messagecontainer', { static: true }) messageContainer!: ElementRef;

  userDefaultImg = 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png';

  constructor(private chatService: ChatService, private dataService: DataService, private authService: AuthService, private signalrService: SignalRService) {
    this.chatSubscription = this.chatService.getSelectedChat().subscribe((chat) => {
      this.selectedChat = chat;
      this.getMessages();
      })
  }

  ngOnInit(): void {
    this.getMessages();
    this.signalrService.messageUpdate$.subscribe((chatId) => {
      if(this.selectedChat?.chatId === chatId) {
        this.getMessages();
      }
    })
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }

  
  getMessages() {
    if (this.selectedChat) {
      this.dataService.getMessages(this.selectedChat.chatId).subscribe(
        (result) => {
          this.messages = result;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  sendMessage() {
    if(this.selectedChat) {
      if(this.sendMessageText.length > 0) {
        this.dataService.sendMessage(this.selectedChat?.chatId, this.sendMessageText).subscribe(
          (result) => {
            this.getMessages();
          }
        );
        this.sendMessageText = '';
      }
    }
  }

  isMessageFromCurrentUser(message: Message): boolean {
    const currentUserId = Number(this.authService.getUserId());
    return message.userId === currentUserId;
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      console.log('Scrolling to bottom...');
    }
  }
}
export class Message {
  messageId: string = '';
  userId: number = 0;
  userName: string = '';
  content: string = '';
  date: string = '';
}