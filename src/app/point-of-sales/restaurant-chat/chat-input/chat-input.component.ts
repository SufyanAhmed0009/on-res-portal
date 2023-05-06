import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit {

  messageContent: string = "";
  @Output('send') send = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    let textarea: any = document.querySelector(".resize-ta");
    textarea.addEventListener("keyup", () => {
      textarea.style.height = this.calcHeight(textarea.value) + "px";
    });

  }

  calcHeight(value: any) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    // min-height + lines x line-height + padding + border
    let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 12;
    return newHeight;
  }

  onSendMessage() {
    let message = this.messageContent.trim();
    if (message != '') {
      this.send.emit(this.messageContent);
      setTimeout(
        () => {
          this.messageContent = '';
          let textarea: any = document.querySelector(".resize-ta");
          textarea.style.height = "44px";
        }, 50
      );
    }
  }

}

