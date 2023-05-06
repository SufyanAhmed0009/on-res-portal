import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ServiceFranchise {

  constructor(private http: HttpClient) { }

  
  fetchFranchiseDetails(hqIds: number[], langId: number){
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._FRANCHISE.GET.FRANCHISE_DETAILS + hqIds +"/"+ langId
    )
  }
}
