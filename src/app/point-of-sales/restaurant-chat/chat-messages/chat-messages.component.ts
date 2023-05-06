import { Component, Input, OnInit } from '@angular/core';
import { DtSelectedUserMessage } from 'src/app/core/models/chat';
import { ServiceChat } from 'src/app/core/services/chat.service';
import { ServiceImageModal } from 'src/app/core/services/image-modal.service';

@Component({
  selector: 'chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.css']
})
export class ChatMessagesComponent implements OnInit {

  
  @Input('selectedUserMessages') public userMessages: DtSelectedUserMessage[];

  constructor(
    private imageModelService: ServiceImageModal,
  ) { }

  ngOnInit(): void {
    console.log("this.userMessages")
    console.log(this.userMessages)
  }

  getLines(message: string) {
    if (message) {
      return message.split('\n');
    }
    else {
      return message;
    }
  }

  onShowImage(imageUrl: string) {
    this.imageModelService.openImageModal(imageUrl);
  }

}

