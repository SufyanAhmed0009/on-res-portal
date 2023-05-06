import { Direction } from '@angular/cdk/bidi';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { AppType, DtSelectedUserMessage, DtUserMessage, ModelListMessage, ModelMessagePageInfo, ModelMessageResponse, ReqSendImageMessage } from 'src/app/core/models/chat';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceChat } from 'src/app/core/services/chat.service';
import { ServiceFranchise } from 'src/app/core/services/franchise.service';
import { ServiceImage } from 'src/app/core/services/image.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceOrders } from 'src/app/core/services/orders.service';
import { ServiceSelectors } from 'src/app/core/services/selectors.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ChatStartComponent } from '../chat-start/chat-start.component';

@Component({
  selector: 'chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit {

  /* LOADERS */
  connecting: boolean;
  loading: boolean;
  loadingMore: boolean;

  /* PAGE */
  page: ModelMessagePageInfo;
  userListpage: ModelMessagePageInfo;

  /* FRANCHISES */
  franchises: DtSelectItem[];
  selectedFranchise: number;

  /* SUBSCRIPTIONS */
  subConnect$: Subscription;
  subAutoReconnect$: Subscription;
  subMessages$: Subscription;

  /* MESSAGES */
  private messages: DtUserMessage[] = [];
  public selectedMessages: DtSelectedUserMessage[];
  issuesOnly: boolean = false;
  selectedUser: DtUserMessage;

  /* TOGGLE FULL-SCREEN */
  containerClass: string;

  /* CUSTOMER TAGS */
  //  selectedCustomerTags: DtCustomerTag[];
  selectedCustomerTags: any[];

  /* SEARCH INPUT */
  searchInput: string = "";

  AppTypes: AppType[] = [];


  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  constructor(
    private chatService: ServiceChat,
    private languageService: ServiceLanguage,
    private franchiseService: ServiceFranchise,
    private matDialog: MatDialog,
    private authService: ServiceAuth,
    private snackbarService: ServiceSnackbar,
    private imageService: ServiceImage,
    private datePipe: DatePipe,
    private selectorsService: ServiceSelectors,
    private ordersService: ServiceOrders,
  ) { }

  ngOnInit(): void {
    this.getAppType();
    this.initPage();
    this.getFranchises();
    if (!this.connected()) {
      this.connect();
    }
    this.setAutoReconnect();
    this.initMessages();
  }



  ngAfterViewInit(): void {
    this.viewport.elementScrolled()
      .subscribe(event => {
        const end = this.viewport.getRenderedRange().end;
        const total = this.viewport.getDataLength();
        if (end === total) {
          this.userListpage.listStart++;
          this.initMessages();
        }
      });
  }

  getMessages() {
    let messages = this.messages;
    let searchInput = this.searchInput.trim();
    if (searchInput != "") {
      messages = messages.filter(
        (item) => {
          return item.user.toLowerCase().includes(searchInput);
        }
      )
    }
    if (this.selectedFranchise != null) {
      messages = messages.filter(
        (item) => {
          return item.hqId == this.selectedFranchise;
        }
      )
    }
    if (!this.issuesOnly) {
      return messages;
    } else {
      return messages.filter((item) => item.issue);
    }
  }

  connect() {
    this.connecting = true;
    this.subConnect$ = this.chatService.connect().subscribe(
      (response: boolean) => {
        if (response) {
          this.subscribeForMessages();
        }
        this.connecting = false;
      },
    );
  }

  onSearch() {

  }

  initMessages() {
    this.loading = true;
    console.log(this.userListpage);
    this.chatService.getOldMessages(this.userListpage).subscribe(
      (data: ModelMessageResponse[]) => {
        this.loading = false;
        console.log("message")
        console.log(data)
        this.messages = this.messages.concat(data.map(
          (item) => {
            let time = null;
            let date = null;
            if (item.sendAt) {
              date = new Date(item.sendAt + 'Z');
              time = date.getTime();
            }
            return {
              id: +item.userId,
              message: item.message,
              user: item.userName,
              time: time,
              date: date,
              read: true,
              issue: item.issue,
              hqId: item.hqId,
              filePresent: item.filePresent,
              appType: item.appType,
              appTypeTitle: item.appType ? this.AppTypes?.find((x) => x.code == item.appType)?.name : ''
            }
          }
        ));
        console.log(this.messages.length)
      }
    );
  }

  setAutoReconnect() {
    this.subAutoReconnect$ = interval(500).subscribe(() => {
      if (!(this.connecting)) {
        if (this.connected() == false) {
          this.connect();
        }
      }
    });
  }

  initPage() {
    this.page = {
      listSize: 20,
      listStart: 0
    }
    this.userListpage = {
      listSize: 100,
      listStart: 0
    }
  }

  getFranchises() {
    //  this.franchiseService.getListOfAllFranchises().subscribe(
    //    (response: DtSelectItem[]) => {
    //      this.franchises = response.map(
    //        (item) => {
    //          return {
    //            id: item.id,
    //            title: item.title,
    //            details: null
    //          }
    //        }
    //      );
    //    }
    //  );
  }

  /* LISTENING FOR NEW MESSAGES */

  subscribeForMessages() {
    this.subMessages$ = this.chatService.subsribeMyMessages().subscribe(
      (response) => {
        let message: ModelMessageResponse = JSON.parse(response.body);
        let userId = +message.userId;
        if (this.selectedUser) {
          if (this.selectedUser.id == userId) {
            this.addToActiveMessages(message);
          } else {
            this.addToMessagesList(message);
          }
        } else {
          this.addToMessagesList(message);
        }
      },
    );
  }

  /* OTHER METHODS */
  connected() {
    return this.chatService.isConnected();
  }

  toggleIssuesOnly() {
    this.issuesOnly = !this.issuesOnly;
  }

  onSelectUser(message: DtUserMessage) {
    message.read = true;
    this.selectedUser = message;
    this.page.listSize = 20;
    this.page.chatMessages = {
      userId: message.id + ''
    };
    this.loading = true;
    this.chatService.getUserMessages(this.page).subscribe(
      (messages: ModelListMessage[]) => {
        messages = messages.reverse();
        console.log("messages")
        console.log(messages)
        this.setMessages(messages);
        this.scrollToBottom();
        this.loading = false;
      }
    );

    //  this.messagesService.getUserTags(message.id).subscribe(
    //    (response: RespCustomerTag[]) => {
    //      this.selectedCustomerTags = response.map(
    //        (item) => {
    //          return {
    //            id: item.apptypeId,
    //            title: item.apptypeName,
    //            primary: item.isPrimary
    //          }
    //        }
    //      );
    //    },
    //    (error) => {
    //      this.selectedCustomerTags = [];
    //    }
    //  );
  }

  onLoadMoreMessages() {
    this.page.listSize += 20;
    this.loadingMore = true;
    this.chatService.getUserMessages(this.page).subscribe(
      (messages: ModelListMessage[]) => {
        messages = messages.reverse();
        this.setMessages(messages);
        // this.scrollToBottom();
        this.loadingMore = false;
      }
    );
  }

  onLoadMoreUser() {
    this.userListpage.listStart++;
    this.loading = true;
    this.initMessages();
  }

  onToggleScreen() {
    if (this.containerClass) {
      this.containerClass = null;
      document.exitFullscreen();
    } else {
      this.containerClass = "chat-container-full";
      let el = document.getElementsByTagName("BODY")[0];
      el.requestFullscreen();
    }
  }

  onDisplayCustomerOrders() {
    //  this.matDialog.open(CustomerOrdersComponent, {
    //    width: '700px',
    //    // data: this.selectedUser.id,
    //    data: {
    //      userId: this.selectedUser.id,
    //      orderIds: null
    //    },
    //    direction: <Direction>this.languageService.getCurrentLanguage().dir,
    //    autoFocus: false,
    //    maxHeight: '90vh'
    //  });
  }

  onUpdateUserTagging() {
    //  let dialogRef = this.matDialog.open(ChatUserTaggingComponent, {
    //    width: '500px',
    //    data: {
    //      id: this.selectedUser.id,
    //      tags: this.selectedCustomerTags

    //    },
    //    direction: <Direction>this.languageService.getCurrentLanguage().dir,
    //    autoFocus: false,
    //    maxHeight: '90vh'
    //  });
    //  dialogRef.afterClosed().subscribe(
    //    (response) => {
    //      if (response) {
    //        this.messagesService.getUserTags(this.selectedUser.id).subscribe(
    //          (response: RespCustomerTag[]) => {
    //            this.selectedCustomerTags = response.map(
    //              (item) => {
    //                return {
    //                  id: item.apptypeId,
    //                  title: item.apptypeName,
    //                  primary: item.isPrimary
    //                }
    //              }
    //            );
    //          },
    //          (error) => {
    //            this.selectedCustomerTags = [];
    //          }
    //        );
    //      }
    //    }
    //  );
  }

  onFix() {
    this.loading = true;
    this.chatService.closeIssue(this.selectedUser.id + '').subscribe(
      (response) => {
        this.selectedUser.issue = false;
        this.loading = false;
      },
      (error) => {
        this.selectedUser.issue = false;
        this.loading = false;
      }
    );
  }

  onUpload(event: any) {
    if (event.target.files.length == 0) {
      this.snackbarService.showErrorMessage("No File Selected!");
    } else {
      const file = event.target.files[0];
      this.imageService.getImageBase64String(file).subscribe(
        (response) => {
          if (response.valid) {
            let request: ReqSendImageMessage = {
              message: null,
              userId: this.selectedUser.id,
              fromUser: false,
              ccId: this.authService.getUserId(),
              sendFile: true,
              filePresent: true,
              sendAt: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              fileContent: response.fileUrl
            }
            this.chatService.sendImage(request).subscribe(
              (response) => {
                console.log("response");
                console.log(response);
              }
            );
          } else {
            this.snackbarService.showErrorMessage("File is not a valid image.");
          }
        }
      )
    }
  }

  onSend(message: string) {
    this.chatService.sendMessage({
      message: message,
      ccid: +this.authService.getUserId(),
      userId: this.selectedUser.id + "",
      fromUser: false,
      ccName: this.authService.getFullName(),
      sendAt: Date.now(),
    });
  }

  onStartNewChat() {
     this.matDialog.open(ChatStartComponent, {
       width: '500px',
       direction: <Direction>this.languageService.getCurrentLanguage().dir,
       autoFocus: false,
       maxHeight: '90vh'
     });
  }

  setMessages(messages: ModelListMessage[]) {
    this.selectedMessages = messages.map(
      (message) => {
        let date: Date = null;
        let time = null;
        if (message.sendAt) {
          date = new Date(message.sendAt + 'Z');
          time = date.getTime();
        }
        return {
          message: message.message,
          time: time,
          date: date,
          from: message.fromUser,
          ccName: message.ccName,
          filePresent: message.filePresent,
          url: message.url,
          appType: message.appType,
          appTypeTitle: message.appType ? this.AppTypes?.find((x) => x.code == message.appType).name : ''
        }
      }
    );
  }

  /* PRIVATE METHODS */
  private addToActiveMessages(message: ModelMessageResponse) {
    let selectedMessage: DtSelectedUserMessage = {
      message: message.message,
      time: Date.now(),
      date: new Date(),
      from: message.fromUser,
      ccName: message.ccName,
      filePresent: message.filePresent,
      url: message.url,
      appType: message.appType,
      appTypeTitle: message.appType ? this.AppTypes?.find((x) => x.code == message.appType).name : '',
    }
    this.selectedMessages.push(selectedMessage);
    let index = this.messages.findIndex(
      (item) => {
        return item.id == +message.userId
      }
    );
    let selectedUser = this.messages[index];
    selectedUser.time = Date.now();
    selectedUser.date = new Date();
    selectedUser.read = false;
    selectedUser.message = message.message;
    selectedUser.issue = true;
    selectedUser.filePresent = message.filePresent,
      selectedUser.url = message.url,
      selectedUser.appType = message.appType,
      selectedUser.appTypeTitle = message.appType ? this.AppTypes?.find((x) => x.code == message.appType).name : ''
    this.messages.splice(index, 1);
    this.messages = [selectedUser, ...this.messages];
    this.scrollToBottom();
  }

  private addToMessagesList(message: ModelMessageResponse) {
    let index = this.messages.findIndex(
      (item) => {
        return item.id == +message.userId
      }
    );
    if (index == -1) {
      let userId = +message.userId;
      this.chatService.getNameById(userId).subscribe(
        (response: { firstName: string; }) => {
          console.log("user msg response")
          console.log(response)
          let name = response.firstName;
          let userMessage: DtUserMessage = {
            id: userId,
            message: message.message,
            user: name,
            time: Date.now(),
            date: new Date(),
            read: false,
            issue: true,
            filePresent: message.filePresent,
            url: message.url,
            appType: message.appType,
            appTypeTitle: message.appType ? this.AppTypes?.find((x) => x.code == message.appType).name : ''

          };
          this.messages = [userMessage, ...this.messages];
        }
      );

    } else {
      let selectedUser = this.messages[index];
      selectedUser.time = Date.now();
      selectedUser.date = new Date();
      selectedUser.read = false;
      selectedUser.message = message.message;
      selectedUser.filePresent = message.filePresent;
      selectedUser.url = message.url;
      selectedUser.appType = message.appType;
      selectedUser.appTypeTitle = message.appType ? this.AppTypes?.find((x) => x.code == message.appType).name : ''
      this.messages.splice(index, 1);
      selectedUser.issue = true;
      this.messages = [selectedUser, ...this.messages];
    }
  }

  private scrollToBottom() {
    try {
      setTimeout(
        () => {
          let container = document.getElementById("msgContainer");
          container.scrollTop = container.scrollHeight;
        }, 100
      )
    } catch (err) {
      console.error(err);
    }
  }

  /* UNSUBSCRIBING ON DESTROY */

  ngOnDestroy() {
    if (this.subAutoReconnect$) {
      this.subAutoReconnect$.unsubscribe();
    }
    if (this.subConnect$) {
      this.subConnect$.unsubscribe();
    }
    if (this.subMessages$) {
      this.subMessages$.unsubscribe();
    }
  }

  /* ON FRANCHISE SELECTION */
  onFranchiseSelected(franchise: DtSelectItem) {
    this.selectedFranchise = franchise.id;
  }

  onFranchiseCleared() {
    if (this.selectedFranchise !== null) {
      this.selectedFranchise = null;
    }
  }

  /* GET ALL APP TYPES*/
  getAppType() {
    this.chatService.getAppType().subscribe(
      (response: AppType[]) => {
        this.AppTypes = response;
        console.log("this.AppTypes")
        console.log(this.AppTypes)
      }
    );
  }

  // ON COMPLAIN MODAL
  onComplain(event: Event) {
    event.stopPropagation();
    // this.matDialog.open(ModalOrderComplainComponent, {
    //   width: '6000px',
    //   data: { userId: this.selectedUser.id, addressId: null, orderId: null, isBlank: false },
    //   direction: <Direction>this.languageService.getCurrentLanguage().dir,
    //   autoFocus: false,
    //   maxHeight: '90vh'
    // });
  }

  /* MAP BUTTON CLICK */
  onClickMap() {
    // this.matDialog.open(ModalFranchisesMapComponent, {
    //   width: '2500px',
    //   maxWidth: '95vw',
    //   data: { viewOnly: true },
    //   direction: <Direction>this.languageService.getCurrentLanguage().dir,
    //   autoFocus: false,
    //   maxHeight: '95vh'
    // });
  }

}

