import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelCountry } from '../models/country';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';
import { StorageConstants } from '../static/storage_constants';
import { ServiceAuth } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceCountry {

  constructor(private http: HttpClient,
    private authenticationService: ServiceAuth) { }

  setCountries() {
    if (this.getCountries().length == 0) {
      this.http.get(
        AppConstants.SERVER_READONLY_URL + ApiConstants._COUNTRY.GET.COUNTRIES
      ).subscribe(
        (data: ModelCountry[]) => {
          localStorage.setItem(StorageConstants.COUNTRIES, JSON.stringify(data));
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  getCountries(): ModelCountry[] {
    if (localStorage.getItem(StorageConstants.COUNTRIES)) {
      return JSON.parse(localStorage.getItem(StorageConstants.COUNTRIES));
    } else {
      return [];
    }
  }

  getListOfCountries() {
    return this.http.get(
      AppConstants.SERVER_READONLY_URL + ApiConstants._COUNTRY.GET.SELECT_COUNTRIES
    );
  }

  getListOfCities(countryIdList: number[]){
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._COUNTRY.POST.SELECT_CITIES,
      { countryIdList }
    );
  }

  getCountryCodes(): ModelCountry[] {
    return [
      { code: '+92', country: 'Pakistan' },
      { code: '+966', country: 'Saudi Arabia' },
      { code: '+1', country: 'Canada' },
      { code: '+965', country: 'Kuwait' },
      { code: '+44', country: 'UK' },
      { code: '+971', country: 'UAE' },
      { code: '+973', country: 'Bahrain' },
    ];
  }

}

