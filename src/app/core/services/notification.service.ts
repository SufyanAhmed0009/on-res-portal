import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { ModelNotificationRequest, ModelNotificationUpdateRequest } from '../models/notification';
import { DtPage } from '../models/page';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ServiceNotification {

  // EMITS EVENT TO RELOAD DATA.
  dataUpdated = new EventEmitter<void>();

  constructor(
      private http: HttpClient
  ) { }

  getNotificationsList(page: DtPage) {
      return this.http.get(
          AppConstants.SERVER_READONLY_URL +
          ApiConstants._NOTIFICATIONS.GET.LIST + page.page +
          '/' + page.size
      );
  }

  getNotificationUsers(id: number) {
      return this.http.get(
          AppConstants.SERVER_READONLY_URL + ApiConstants._NOTIFICATIONS.GET.USERS_LIST + id
      );
  }

  createNotification(request: ModelNotificationRequest) {
      return this.http.post(
          AppConstants.SERVER_URL +
          ApiConstants._NOTIFICATIONS.POST.CREATE,
          request
      );
  }

  updateNotification(request: ModelNotificationUpdateRequest) {
      return this.http.put(
          AppConstants.SERVER_URL + ApiConstants._NOTIFICATIONS.PUT.UPDATE_NOTIFICATION,
          request
      )
  }

}