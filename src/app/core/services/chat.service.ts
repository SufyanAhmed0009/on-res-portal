import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ModelMessagePageInfo, ModelMessageResponse, ReqSendImageMessage } from '../models/chat';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';
import { ServiceAuth } from './auth.service';

declare var SockJS;
declare var Stomp;

@Injectable({
  providedIn: 'root'
})
export class ServiceChat {

  private _client: any;

  constructor(
      private http: HttpClient,
      private authService: ServiceAuth
  ) { }

  getOldMessages(request) {
      return this.http.post(
          AppConstants.CHAT_SERVER_URL + ApiConstants._CHAT.POST.HISTORY,
          request
      )
  }

  connect(): Observable<boolean> {
    return Observable.create(
        (observer: Observer<boolean>) => {
            // let socket = new SockJS('https://gke-r.october-now.com/so/');
            let socket = new SockJS('https://master.october-now.com/chat/chatMessaging');
            this._client = Stomp.over(socket);
            this._client.connect(
                {},
                (frame: string) => {
                    let body = { "subscriberId": "c" + this.authService.getUserId() };
                    this._client.send(
                        '/app/addCustomerCare', {},
                        JSON.stringify(body)
                    );
                    observer.next(true);
                    // observer.complete();
                },
                (error: string) => {
                    observer.next(false);
                    this.connect();
                    // observer.complete();
                }
            );
        }
    );
}


  isConnected(): boolean {
      if (this._client) {
          return this._client.connected;
      } else {
          return false;
      }
  }

  getNameById(userId: number) {
      return this.http.post(
          AppConstants.CHAT_SERVER_URL + ApiConstants._CHAT.POST.USERNAME_BY_ID,
          {
              chatMessages: {
                  ccid: "" + userId
              }
          }
      );
  }

  subsribeMyMessages(): Observable<{ body: string }> {
      return Observable.create(
          (observer: Observer<string>) => {
              if (this.isConnected()) {
                  this._client.subscribe(
                      // '/topic/customerCare/c' + this.authService.getUserId(),
                      '/topic/message',
                      (message: string) => {
                          observer.next(message);
                      }
                  );
              }
          }
      );
  }

  subscribeCcMessages(): Observable<{ body: string }> {
      return Observable.create(
          (observer: Observer<string>) => {
              if (this.isConnected()) {
                  this._client.subscribe(
                      '/topic/customerCare/cc',
                      (message: string) => {
                          observer.next(message);
                      }
                  );
              }
          }
      );
  }

  disconnect() {
      this._client.disconnect();
  }

  getMyId(): number {
      return this.authService.getUserId();
  }

  sendMessage(message: ModelMessageResponse) {
      this._client.send(
          '/app/message', {},
          JSON.stringify({
              ...message,
              ccId: this.authService.getUserId()
          })
      );
  }

  // Inprogress
  sendImage(message: ReqSendImageMessage) {
      return this.http.post(
          AppConstants.CHAT_SERVER_URL + ApiConstants._CHAT.POST.SEND_IMAGE,
          message
      )
  }


  getUserMessages(page: ModelMessagePageInfo) {
      return this.http.post(
          AppConstants.CHAT_SERVER_URL + ApiConstants._CHAT.POST.USER_MESSAGES,
          page
      );
  }

  closeIssue(userId: string) {
      return this.http.post(
          AppConstants.CHAT_SERVER_URL + ApiConstants._CHAT.POST.CLOSE_ISSUE,
          {
              chatIssue: {
                  userId: userId
              }
          }
      );
  }

  searchUsers(keyword: string) {
      return this.http.get(
          AppConstants.CHAT_SERVER_URL + ApiConstants._CHAT.GET.SEARCH_USERS + keyword
      );
  }

  getUserTags(id: number) {
      return this.http.get(
          AppConstants.SERVER_READONLY_URL
          + ApiConstants._CHAT.GET.USER_TAGS
          + id
      )
  }

  // updateUserTags(request: ReqUpdateCustomerTags) {
  updateUserTags(request: any) {
      return this.http.post(
          AppConstants.SERVER_URL
          + ApiConstants._CHAT.POST.UPDATE_USER_TAGS,
          request
      );
  }

  getAppType() {
      return this.http.get(
          AppConstants.SERVER_URL
          + ApiConstants._CHAT.GET.APP_TYPE
      );
  }

}
