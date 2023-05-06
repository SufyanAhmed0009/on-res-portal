import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { ServiceLanguage } from './language.service';
import { DtPage } from '../models/page';

@Injectable({
    providedIn: 'root'
})
export class ServiceSelectors {

    constructor(
        private http: HttpClient,
        private languageService: ServiceLanguage
    ) { }

    selectStores(keyword: string, franchiseId: number) {
        return this.http.get(
            AppConstants.SERVER_READONLY_URL
            + ApiConstants._SELECTORS.GET.STORES
            + keyword + '/' + franchiseId
        )
    }

    selectProducts(keyword: string, storeId: number) {
        let langId = this.languageService.getCurrentLanguage().id;
        let page: DtPage = {
            page: 0,
            size: 10,
            title: keyword,
            id: storeId,
            languageId: langId
        }
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._INVENTORY.POST.STORE_PRODUCTS_LIST,
            page
        );
    }

    selectCategories() {
        return this.http.get(
            AppConstants.SERVER_READONLY_URL
            + ApiConstants._SELECTORS.GET.CATEGORIES
        );
    }

    selectAppUsersTwo(keyword: string, franchiseId: number) {
        return this.http.get(
            AppConstants.SERVER_READONLY_URL
            + ApiConstants._SELECTORS.GET.APP_USERS
            + keyword + "/" + franchiseId
        );
    }

}