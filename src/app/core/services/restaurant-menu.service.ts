import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { ServiceLanguage } from './language.service';
import { RestaurantMenuCategoryRequest, UpdateStatusRequest } from '../models/restaurant-menu';
import { Modifier } from '../models/restaurant-menu';

@Injectable({
    providedIn: 'root'
})
export class RestaurantMenuService {

    dataUpdated = new EventEmitter<void>();
    dateUpdated = new EventEmitter<void>();
    menuUpdated = new EventEmitter<void>();
    statusConfirmed = new EventEmitter<{ id: number }>();

    constructor(
        private http: HttpClient,
        private languageService: ServiceLanguage
    ) { }

    getRestaurantMenu(restaurantId?: number) {
        let langId = this.languageService.getCurrentLanguage().id;
        return this.http.get(
            AppConstants.SERVER_READONLY_URL +
            ApiConstants._RESTAURANTMENU.GET.MENU_ITEM +
            restaurantId + '/' + langId
        );
    }

    updateMenuItemStatus(request: UpdateStatusRequest) {
        return this.http.put(
            AppConstants.SERVER_URL +
            ApiConstants._RESTAURANTMENU.PUT.STATUS_UPDATE,
            request
        );
    }

    updateMenuItemModifierStatus(request: UpdateStatusRequest, modifier: Modifier) {
        if (modifier.groupId == 0) {
            return this.http.put(
                AppConstants.SERVER_URL +
                ApiConstants._RESTAURANTMENU.PUT.SIZE_STATUS_UPDATE,
                request
            );
        }
        else if (modifier.groupId == -3) {
            return this.http.put(
                AppConstants.SERVER_URL +
                ApiConstants._RESTAURANTMENU.PUT.TOPPING_STATUS_UPDATE,
                request
            );
        }
        else if (modifier.groupId == -2) {
            return this.http.put(
                AppConstants.SERVER_URL +
                ApiConstants._RESTAURANTMENU.PUT.COOKTYPE_STATUS_UPDATE,
                request
            );
        }
        else if (modifier.groupId == -1) {
            return this.http.put(
                AppConstants.SERVER_URL +
                ApiConstants._RESTAURANTMENU.PUT.FLAVOUR_STATUS_UPDATE,
                request
            );
        }
    }

    getMenuCategoryDetails(menuCategoryId: number, langId: number) {
        return this.http.get(
            AppConstants.SERVER_READONLY_URL + ApiConstants._MENU_CATEGORY.GET.MENU_CATEGORY_DETAILS
            + menuCategoryId + '/' + langId
        )
    }

    getMenuCategoryList(request: RestaurantMenuCategoryRequest) {
        return this.http.post(
            AppConstants.SERVER_URL 
            + ApiConstants._MENU_CATEGORY.POST.MENU_CATEGORY_LIST,
            request
        )
    }

    updateMenuCategory(request) {
        return this.http.put(
            AppConstants.SERVER_URL + ApiConstants._MENU_CATEGORY.PUT.UPDATE_MENU_CATEGORY,
            request
        );
    }
}