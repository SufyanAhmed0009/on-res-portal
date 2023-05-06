import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceChat } from 'src/app/core/services/chat.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'chat-start',
  templateUrl: './chat-start.component.html',
  styleUrls: ['./chat-start.component.css']
})
export class ChatStartComponent implements OnInit {

  searchInput: string = '';
  messageInput: string = '';
  searchList: SearchUserResponse[] = [];
  selectedUserId: number = -1;

  constructor(
    private chatService: ServiceChat,
    private dialogRef: MatDialogRef<ChatStartComponent>,
    private snackBarService: ServiceSnackbar,
    private authService: ServiceAuth,
  ) { }

  ngOnInit(): void {

  }

  onChange() {
    if (this.searchInput.length > 4) {
      this.chatService.searchUsers(this.searchInput).subscribe(
        (response: SearchUserResponse[]) => {
          this.searchList = response;
          this.selectedUserId = -1;
        }
      );
    }
  }

  onSelect(user: SearchUserResponse) {
    this.selectedUserId = user.id;
  }

  onSendMessage() {
    this.chatService.sendMessage({ 
      message: this.messageInput,
      ccid: +this.authService.getUserId(),
      userId: this.selectedUserId + "",
      fromUser: false,
      ccName: this.authService.getFullName(),
      sendAt: Date.now(),
    });
    this.dialogRef.close();
  }

  onClose(){
    this.dialogRef.close();
  }

}

class SearchUserResponse {
  id: number;
  firstName: string;
  phone: string;
  message?: string;
}