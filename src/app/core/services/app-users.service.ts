import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DtPage, DtPageInfo } from '../models/page';
import { ModelMembershipInfo } from '../models/user-app';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';
import { ServiceLanguage } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceAppUsers {

  // EMITS EVENT TO RELOAD DATA.
  dataUpdated = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage
  ) { }

  getListOfAppUsers(page: DtPage) {
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._APP_USERS.POST.USERS_LIST,
      page
    );
  }

  getAppUsersMembershipTypes(page: ModelMembershipInfo) {
    return this.http.get(
      AppConstants.SERVER_URL + ApiConstants._APP_USERS.GET.GET_APP_USERS_MEMBERSHIPS
    );
  }

}
