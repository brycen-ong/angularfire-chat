import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserModel } from '../../shared/models/model';
import { ChatService } from '../../shared/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserModel;
  userChat;

  constructor(
    private _authService: AuthService,
    public _chatService: ChatService
  ) { }

  ngOnInit(): void {
    this._authService.getUserInfo().subscribe(data => {
      this.user = data;
    });
    this.userChat = this._chatService.getUserChats();
  }

}
