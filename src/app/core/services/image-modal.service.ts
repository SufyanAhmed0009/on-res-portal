import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from './language.service';
import { ModalImageComponent } from 'src/app/shared/components/modal-image/modal-image.component';

@Injectable({
    providedIn: 'root'
  })
  export class ServiceImageModal{
    constructor(
        private matDialog: MatDialog,
        private languageService: ServiceLanguage
      ) {}

      openImageModal(imageUrl: string){
console.log("image modal")
console.log(imageUrl)
          const initialState = {
              imageUrl: imageUrl
          };
          
          this.matDialog.open(ModalImageComponent, {
            width: '900px',
            data: initialState,
            direction: <Direction> this.languageService.getCurrentLanguage().dir,
            autoFocus: false,
            maxHeight: '90vh'
        })
      }
  }