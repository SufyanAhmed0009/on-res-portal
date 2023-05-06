import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiConstants } from "../static/api_constants";
import { AppConstants } from "../static/app-constants";

@Injectable({
    providedIn: 'root'
  })
export class ServiceRestaurantInvoices {

    constructor(private http: HttpClient) { }

    getRestaurantInvoicesList(id : number)
    {
        console.log(AppConstants.SERVER_READONLY_URL + ApiConstants._RESTAURANT_INVOICES.GET.RESTUARANT_INVOICES_LIST + id);
        return this.http.get(AppConstants.SERVER_READONLY_URL + ApiConstants._RESTAURANT_INVOICES.GET.RESTUARANT_INVOICES_LIST + id);
    }
}