import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageConstants } from '../static/storage_constants';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { ReqLogin } from '../models/login';
import { DtAuthToken } from '../models/auth';
import { DtSelectItem } from '../models/select';
import { Restaurant } from '../models/language';

@Injectable({
  providedIn: 'root'
})
export class ServiceAuth {

  storeChanged = new EventEmitter<DtSelectItem>();
  restaurantChanged = new EventEmitter<Restaurant>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /* SETTER-GETTERS */

  setToken(token: string) {
    localStorage.setItem(StorageConstants.TOKEN, token);
  }

  getToken(): string {
    return localStorage.getItem(StorageConstants.TOKEN);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(StorageConstants.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string {
    return localStorage.getItem(StorageConstants.REFRESH_TOKEN);
  }

  setBranchId(id: number) {
    localStorage.setItem(StorageConstants.BRANCH_ID, (id == null) ? '' : (id + ''));
  }

  getBranchId(): number {
    let id: string = localStorage.getItem(StorageConstants.BRANCH_ID);
    return id == '' ? -1 : +id;
  }

  setRestaurantId(id: number) {
    localStorage.setItem(StorageConstants.RESTUARANT_ID, (id == null) ? '' : (id + ''));
  }

  getRestaurantId(): number {
    let id: string = localStorage.getItem(StorageConstants.RESTUARANT_ID);
    return id == '' ? -1 : +id;
  }
  setRestaurantName(name: string) {
    localStorage.setItem(StorageConstants.RESTUARANT_NAME, name);
  }

  getRestaurantName(): string {
    return localStorage.getItem(StorageConstants.RESTUARANT_NAME);
  }
  setBranchName(name: string) {
    localStorage.setItem(StorageConstants.BRANCH_NAME, name);
  }

  getBranchName(): string {
    return localStorage.getItem(StorageConstants.BRANCH_NAME);
  }

  setUserId(id: number) {
    localStorage.setItem(StorageConstants.USER_ID, id + '');
  }

  getUserId(): number {
    return +localStorage.getItem(StorageConstants.USER_ID);
  }

  setUsername(username: string) {
    localStorage.setItem(StorageConstants.USERNAME, username);
  }

  getUsername(): string {
    return localStorage.getItem(StorageConstants.USERNAME);
  }

  setFullName(name: string) {
    localStorage.setItem(StorageConstants.FULL_NAME, name);
  }

  getFullName(): string {
    return localStorage.getItem(StorageConstants.FULL_NAME);
  }

  setPendingUser(username: string) {
    localStorage.setItem(StorageConstants.PENDING_USER, username);
  }

  getPendingUser() {
    return localStorage.getItem(StorageConstants.PENDING_USER);
  }

  removePendingUser() {
    localStorage.removeItem(StorageConstants.PENDING_USER);
  }

  setUserType(userType: string) {
    if (userType != null) {
      localStorage.setItem(StorageConstants.USER_TYPE, userType);
    }
  }

  getUserType(): string {
    if (localStorage.getItem(StorageConstants.USER_TYPE)) {
      return localStorage.getItem(StorageConstants.USER_TYPE);
    } else {
      return null;
    }
  }

  setUserTypeList(userTypeList: any) {
    if (userTypeList != null) {
      localStorage.setItem(StorageConstants.USER_TYPE_LIST, userTypeList);
    }
  }

  getUserTypeList(): any {
    if (localStorage.getItem(StorageConstants.USER_TYPE_LIST)) {
      return localStorage.getItem(StorageConstants.USER_TYPE_LIST);
    } else {
      return null;
    }
  }

  setFranchiseId(franchiseId: number) {
    if (franchiseId != null) {
      localStorage.setItem(StorageConstants.USER_FRANCHISE, franchiseId + '');
    }
  }

  setBranchesList(branches: any[]) {
    localStorage.setItem(StorageConstants.BRANCHES_LIST, JSON.stringify(branches));
  }

  getBranchesList(): DtSelectItem[] {
    return JSON.parse(localStorage.getItem(StorageConstants.BRANCHES_LIST));
  }
  setRestuarantList(restuarant: any[]) {
    localStorage.setItem(StorageConstants.RESTUARANT_LIST, JSON.stringify(restuarant));
  }

  getRestuarantList(): DtSelectItem[] {
    return JSON.parse(localStorage.getItem(StorageConstants.RESTUARANT_LIST));
  }

  getFranchiseId(): number {
    if (localStorage.getItem(StorageConstants.USER_FRANCHISE)) {
      return +localStorage.getItem(StorageConstants.USER_FRANCHISE);
    } else {
      return null;
    }
  }

  /* AUTHENTICATION METHODS. */

  login(request: ReqLogin) {
    console.log(JSON.stringify(request));
    return this.http.post(
      AppConstants.LOGIN_URL + ApiConstants._AUTH.POST.LOGIN,
      request
    );
  }

  parseToken(token: string): DtAuthToken {

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    let jwt = JSON.parse(jsonPayload);
    return {
      expiryTimestamp: (+jwt.exp) * 1000,
      userName: jwt.sub
    }

  }

  isTokenExpired() {
    let token = this.getToken();
    let currentTimestamp = new Date().getTime();
    return (currentTimestamp > this.parseToken(token).expiryTimestamp);
  }

  getValidToken() {
    if (this.isTokenExpired()) {
      // this.updateToken();
      return this.getRefreshToken();
    } else {
      return this.getToken();
    }
  }

  updateToken() {
    this.http.get(
      AppConstants.SERVER_URL + ApiConstants._AUTH.GET.REFRESH_TOKEN
    ).subscribe(
      (token: { tokenString: string, refreshTokenString: string }) => {
        this.setToken(token.tokenString);
        this.setRefreshToken(token.refreshTokenString);
      }
    );
  }

  isAuthenticated() {
    if (this.getRefreshToken()) {
      let currentTimestamp = new Date().getTime();
      if (this.parseToken(this.getRefreshToken()).expiryTimestamp > currentTimestamp) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem(StorageConstants.TOKEN);
    localStorage.removeItem(StorageConstants.REFRESH_TOKEN);
    this.router.navigate(['/login']);
  }

  /* VALIDATORS */
  checkIfUsernameIsValid(username: { username: string }) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._AUTH.POST.CHECK_IF_VALID_USERNAME,
      username, { responseType: 'text' }
    );
  }

  checkIfStorenameIsValid(username: { title: string }) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._AUTH.POST.CHECK_IF_VALID_STORENAME,
      username, { responseType: 'text' });
  }

  /* OTP VERIFICATION */
  checkUserOtp(data: { email: string, otp: string }) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._AUTH.POST.CHECK_IF_VALID_OTP,
      data
    );
  }

  verifyOtp(data: { email: string, otp: string }) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._AUTH.POST.VERIFY_ACCOUNT,
      data
    );
  }

  /* RESET PASSWORD REQUEST */
  forgotPasswordRequest(email: string) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._AUTH.POST.FORGOT_PASSWORD,
      {
        email: email
      }
    );
  }

  setSpectator(value: boolean) {
    localStorage.setItem(StorageConstants.SPECTATOR, value ? "1" : "0");
  }

  isSpectator(): boolean {
    let value = +localStorage.getItem(StorageConstants.SPECTATOR);
    return value == 1;
  }

  setUserRestaurantList(restList: number[]) {
    const list = JSON.stringify(restList);
    localStorage.setItem(StorageConstants.USER_RESTAURANTS, list);
  }

  getUserRestaurantList(): number[] {
    const list = localStorage.getItem(StorageConstants.USER_RESTAURANTS);
    return JSON.parse(list);
  }
}