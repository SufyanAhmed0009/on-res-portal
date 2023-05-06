import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConstants } from '../static/api_constants';
import { AppConstants } from '../static/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ServiceImage {

  constructor(private http: HttpClient) { }

  uploadImage(data) {
    return this.http.post(
      AppConstants.SERVER_URL + ApiConstants._IMAGE.POST.UPLOAD_IMAGE,
      data
    );
  }

  // FOR UPLOADING COMPLAIN IMAGES TO GCP BUCKET
  // uploadComplainImage(data) {
  //   return this.http.post(
  //     AppConstants.SERVER_URL + ApiConstants._IMAGE.POST.UPLOAD_COMPLAIN_IMAGE_TO_GCP_BUCKET,
  //     data,
  //   );
  // }


  // FOR UPLOADING COMPLAIN IMAGES TO ComplainImage DB
  // insertComplainImageToDB(data) {
  //   return this.http.post(
  //     AppConstants.SERVER_URL + ApiConstants._IMAGE.POST.UPLOAD_COMPLAIN_IMAGE_TO_DB,
  //     data,
  //   );
  // }


  // FOR FETCHING COMPLAIN IMAGES TO ComplainImage DB
  // getComplainImageFromDB(complainId) {
  //   return this.http.get(
  //     AppConstants.SERVER_URL + ApiConstants._IMAGE.GET.GET_COMPLAIN_IMAGE_FROM_DB
  //     + "/" + complainId
  //   );
  // }


  // Inprogress
  getImageBase64String(file: File): Observable<{ valid: boolean, fileUrl: string }> {
    let fileUrl: string = null;
    const reader = new FileReader();
    reader.onload = () => {
      fileUrl = <string>reader.result;
    }
    reader.readAsDataURL(file);
    return this.validateImage(file).pipe(
      map((response: { validImage: boolean }) => {
        if (response.validImage) {
          fileUrl = fileUrl.split(',')[1];
          return {
            valid: true,
            fileUrl
          }
        } else {
          return {
            valid: false,
            fileUrl: null
          }
        }
      })
    );
  }

  /* PRIVATE METHODS */

  validateImage(file: File): Observable<{ [id: string]: any }> {
    const reader = new FileReader();
    const fileReaderObservable = Observable.create(
      (observer: Observer<{ [key: string]: any }>) => {
        reader.addEventListener('loadend', () => {
          const arr = new Uint8Array(<ArrayBuffer>reader.result).subarray(0, 4);
          let header = "";
          let isValid = false;
          arr.forEach(
            (element) => {
              header += element.toString(16);
            }
          );
          switch (header) {
            case "89504e47":
              isValid = true;
              break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
              isValid = true;
              break;
            default:
              isValid = false;
              break;
          }
          if (isValid) {
            observer.next({ validImage: true });
          } else {
            observer.next({ validImage: false });
          }
          observer.complete();
        });
        reader.readAsArrayBuffer(file);
      }
    );
    return fileReaderObservable;
  }

}
