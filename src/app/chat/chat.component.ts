import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chat$: Observable<any>;
  newMsg: string;

  constructor(
    public _chatService: ChatService,
    private _route: ActivatedRoute,
    public _authService: AuthService
  ) { }

  ngOnInit(): void {
    const chatId = this._route.snapshot.paramMap.get('id');
    const source = this._chatService.get(chatId);
    this.chat$ = this._chatService.joinUsers(source);
  }

  submit(chatId){
    this._chatService.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }
}
