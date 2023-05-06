import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ServiceUser {

  constructor(private http: HttpClient) { }

  fetchUserDetails(userIds: number[]){
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._USERS.GET.USER_DETAILS + userIds
    )
  }
}
