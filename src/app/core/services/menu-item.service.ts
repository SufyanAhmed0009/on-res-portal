import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DtPage, DtPageInfo } from '../models/page';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ServiceMenuItem {

  constructor(
    private http: HttpClient
  ) { }

  getMenuItemList(page: DtPageInfo) {
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._MENU_ITEMS.POST.MENU_ITEM_LIST,
      page
    );
  }

}
