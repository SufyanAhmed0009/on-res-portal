import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DtUserMessage } from 'src/app/core/models/chat';

@Component({
  selector: 'chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit {

  @Input('userMessage') userMessage: DtUserMessage;
  @Output('messageSelected') messageSelected = new EventEmitter<DtUserMessage>();
  @Input('selectedUser') selectedUser: DtUserMessage;


  constructor() { }

  ngOnInit(): void {
  }

  onSelectMessage(){
    this.messageSelected.emit(this.userMessage);
  }

  getInitial(name: string){
    if (name){
      return name[0].toUpperCase();
    } else {
      return '?';
    }
  }

}
