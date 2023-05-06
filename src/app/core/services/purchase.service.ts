import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReqPurchase } from '../models/purchases';
import { AppConstants } from '../static/app-constants';
import { ApiConstants } from '../static/api_constants';
import { DtPage } from '../models/page';
import { ServiceLanguage } from './language.service';

@Injectable({
    providedIn: 'root'
})
export class ServicePurchases {

    constructor(
        private http: HttpClient,
        private languageService: ServiceLanguage
    ) { }

    addNewPurchase(request: ReqPurchase) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._PURCHASES.POST.ADD_PURCHASE,
            request
        );
    }

    getPurchaseList(page: DtPage) {
        page.languageId = this.languageService.getCurrentLanguage().id;
        return this.http.post(
            AppConstants.SERVER_READONLY_URL + ApiConstants._PURCHASES.POST.PURCHASE_LIST,
            page
        );
    }

    getPurchaseInfo(purchaseId: number) {
        let langId = this.languageService.getCurrentLanguage().id;
        return this.http.get(
            AppConstants.SERVER_READONLY_URL +
            ApiConstants._PURCHASES.GET.PURCHASE_INFO + purchaseId + '/' + langId
        );
    }

    uploadSheet(request: any) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._PURCHASES.POST.UPLOAD_SHEET,
            request
        );
    }

    confirmSheetUpload(purchaseId: number) {
        return this.http.post(
            AppConstants.SERVER_URL + ApiConstants._PURCHASES.POST.CONFIRM_UPLOAD_SHEET,
            { branchPurchaseId: purchaseId, approve: true }
        );
    }

}