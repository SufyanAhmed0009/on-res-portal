import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { ModalDiscCouponNewRequest, ModalDiscUserListRequest, ModelDiscountCouponRequest, ModelDiscountCouponsPage } from '../models/discount-coupon';
import { DtPage, DtPageInfo } from '../models/page';
import { MembershipCouponRequest } from '../models/user-app';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';
import { ServiceLanguage } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceDiscountCoupon {

  // EMITS EVENT TO RELOAD DATA.
  dataUpdated = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private languageService: ServiceLanguage
  ) { }

  // Old Add Api
  // addDiscountCoupon(request: ModelDiscountCouponRequest) {
  //   return this.http.post(
  //     AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.POST.ADD_COUPON,
  //     request
  //   );
  // }

  // Old Update Api
  updateDiscountCouponOld(request: ModelDiscountCouponRequest) {
    return this.http.put(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.PUT.UPDATE_COUPON,
      request
    );
  }

  // New Add Api
  addDiscountCoupon(request: ModalDiscCouponNewRequest) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.POST.ADD_DISCOUNT_COUPON,
      request
    );
  }

  // New Update Api
  updateDiscountCoupon(request: ModalDiscCouponNewRequest) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.POST.UPDATE_DISCOUNT_COUPON,
      request
    );
  }

  getDiscountCouponList(page: DtPage) {
    page.languageId = this.languageService.getCurrentLanguage().id;
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._DISCOUNT_COUPON.POST.COUPON_LIST,
      page
    );
  }

  getDiscountCouponUsersList(page: ModelDiscountCouponsPage) {
    return this.http.post(
      AppConstants.SERVER_READONLY_URL + ApiConstants._DISCOUNT_COUPON.POST.COUPON_USERS_LIST,
      page
    );
  }

  addNewUser1(request: MembershipCouponRequest) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.POST.ADD_COUPON_USER,
      request
    );
  }

  membershipCoupon(request: MembershipCouponRequest) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.POST.ADD_MEMBERSHIP_COUPON, 
      request
    );
  }

  addNewUser(phone: number, couponId: number, ) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.POST.ADD_COUPON_USER,
      {
        phone: phone,
        couponId: couponId,        
      }
    );
  }

  removeUser(id: number) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.POST.DELETE_COUPON_USER,
      {
        id: id
      }
    );
  }

  getCouponStoresList(couponId: number, page: DtPage) {
    return this.http.post(
      AppConstants.SERVER_READONLY_URL
      + ApiConstants._DISCOUNT_COUPON.POST.COUPON_STORES_LIST
      + couponId + '/' + this.languageService.getCurrentLanguage().id,
      page
    );
  }

  removeStoreFromCoupon(couponId: number, storeId: number) {
    return this.http.delete(
      AppConstants.SERVER_URL
      + ApiConstants._DISCOUNT_COUPON.DELETE.REMOVE_STORE
      + couponId + '/' + storeId
    );
  }

  assignCouponToStore(couponId: number, storeId: number) {
    return this.http.post(
      AppConstants.SERVER_URL
      + ApiConstants._DISCOUNT_COUPON.POST.ASSIGN_COUPON_TO_STORE
      + couponId,
      [storeId]
    );
  }

  addUpdateDiscountCouponUsersInBulk(userList: ModalDiscUserListRequest) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.POST.ADD_DISCOUNT_COUPON_USERS,
      userList
    )
  }

  /* Coupon Type List */
  getCouponTypesList() {
    return this.http.get(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.GET.COUPON_TYPES_LIST
    )
  }

  /* App Type List */
  getAppTypesList() {
    return this.http.get(
      AppConstants.SERVER_URL + ApiConstants._DISCOUNT_COUPON.GET.APP_TYPES_LIST
    )
  }

}

