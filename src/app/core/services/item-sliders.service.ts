import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { ModalAddSlider } from '../models/item-sliders';
import { DtPage, DtPageInfo } from '../models/page';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ServiceItemSliders {


  // EMITS EVENT TO RELOAD DATA.
  dataUpdated = new EventEmitter<void>();

  constructor(
    private http: HttpClient
  ) { }

  getSliderList(request: DtPage) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._ITEM_SLIDERS.POST.GET_SLIDER_LIST,
      request
    );
  }

  onAddUpdateSlider(request: ModalAddSlider) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._ITEM_SLIDERS.POST.ADD_SLIDER,
      request
    );
  }

  onAddItemSlider(request: DtPageInfo) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._ITEM_SLIDERS.POST.ADD_ITEM_SLIDER,
      request
    );

  }
}
