import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ModelImage } from 'src/app/core/models/image';
import { ServiceImage } from 'src/app/core/services/image.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  isUploading: boolean = false;
  isUploaded: boolean = false;
  progress: number;
  imagePreviewUrl: string;

  downloadURL: string;
  fileName: string;

  /* EVENT EMITTER FOR PARENT COMPONENTS */
  @Output('onFileUploaded') onFileUploaded = new EventEmitter<ModelImage>();

  constructor(
    private imageService: ServiceImage,
    private snackBarService: ServiceSnackbar
  ) { }

  ngOnInit() {
    this.progress = 0;
  }

  onSelected($event) {
    if ($event.target.files.length == 0) {
      console.error("No file selected");
    } else {

      // GETTING FILE OBJECT
      const file = $event.target.files[0];

      // CREATING IMAGE PREVIEW.
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = <string>reader.result;
      }
      reader.readAsDataURL(file);
      console.log("====================================this.imagePreviewUrl============================================");
      console.log(this.imagePreviewUrl);



      //ADDING IMAGE VALIDATION.
      this.onValidate(file).subscribe(
        (response: { validImage: boolean }) => {
          if (response.validImage){
            this.uploadImage(file);
          } else {
            this.snackBarService.showErrorMessage("FILE FORMAT NOT SUPPORTED!");
          }
        }
      );
      this.uploadImage(file);
    }
  }

  uploadImage(imageFile: File) {
    this.isUploading = true;
    this.progress = 10;
    const formData = new FormData();
    formData.append('file', imageFile);

    this.imageService.uploadImage(formData).subscribe(
      (data: { fileName: string; id: number }) => {
        let imageModel: ModelImage = {
          imageId: data.id,
          fileName: data.fileName,
          fileUrl: this.imagePreviewUrl
        }
        this.progress = 100;
        this.isUploaded = true;
        this.isUploading = false;
        this.onFileUploaded.emit(imageModel);
        console.log("==============================IMG UPLOADED SUCCESSFULLY================================");
        console.log(imageModel);
      },
      (error) => {
        this.snackBarService.showErrorMessage("Error Uploading Image! Try again!");
        this.progress = 0;
        this.isUploading = false;
      }
    );

  }

  /* IMAGE VALIDATOR */
  onValidate(file: File): Observable<{ [id: string]: any }> {
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
              isValid = false; // Or you can use the blob.type as fallback
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
