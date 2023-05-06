import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { DtPageInfo } from '../models/page';
import { SliderImageRequest } from '../models/slider-image';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ServiceSliderImage {

 
  // EMITS EVENT TO RELOAD DATA.
  dataUpdated = new EventEmitter<void>();

  constructor(
    private http: HttpClient
  ) { }


  getSliderImageList(page: DtPageInfo, statusId?: number) {
    return this.http.post(
      AppConstants.SERVER_URL
      + ApiConstants._SLIDER_IMAGE.POST.SLIDER_IMAGE_LIST,
        page
    );
  }

  addUpdateSliderImage(request: SliderImageRequest) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._SLIDER_IMAGE.POST.ADD_SLIDER_IMAGE,
      request
    );
  }

}
