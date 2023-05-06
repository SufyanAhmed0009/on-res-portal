import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { PauseRestaurantRequest } from "src/app/restaurant-settings/restaurant-settings/pause-restaurant/pause-restaurant.component";
import { UpdateRestaurantStatusRequest } from "src/app/restaurant-settings/restaurant-settings/update-status/update-status.component";
import { DtPageInfo } from "../models/page";
import { AddRestaurant } from "../models/restaurant";
import { ApiConstants } from "../static/api_constants";
import { AppConstants } from "../static/app-constants";

@Injectable({
    providedIn: 'root'
})

export class ServiceRestaurant {
    dataUpdated = new EventEmitter<void>();

    constructor(
        private http: HttpClient,
    ) { }

    getRestaurantList(request: DtPageInfo) {
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._RESTAURANTS.POST.RESTAURANT_LIST,
          request
        );
      }

    getRestaurantDetails(page: DtPageInfo) {
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._RESTAURANTS.POST.RESTAURANT_DETAILS,
            page
        )
    }

    deleteTime(timingId: number) {
        return this.http.get(
            AppConstants.SERVER_URL + ApiConstants._RESTAURANTS.GET.DELETE_RESTAURANT_TIME
            + timingId
        );
    }

    updateRestaurant(request: AddRestaurant) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._RESTAURANTS.POST.ADD_UPDATE_RESTAURANT,
            request
        );
    }
    getRestaurantStatus(restId: number) {
        return this.http.get(
            AppConstants.SERVER_URL + ApiConstants._RESTAURANT.GET.GET_STATUS +restId
        );
    }
    updateRestaurantStatus(request: UpdateRestaurantStatusRequest) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._RESTAURANT.POST.UPDATE_STATUS,
            request,
            {observe: 'response'}
        );
    }
    PauseRestaurant(request: PauseRestaurantRequest) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._RESTAURANT.POST.PAUSE_RESTAURANT,
            request,
            {observe: 'response'}
        );
    }
}