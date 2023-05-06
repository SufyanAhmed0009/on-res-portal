import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelImage } from 'src/app/core/models/image';
import { Restaurant } from 'src/app/core/models/language';
import { Dropdown, ModelStatus } from 'src/app/core/models/restaurant-menu';
import { SliderImageRequest, SliderImageResponse } from 'src/app/core/models/slider-image';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceMenu } from 'src/app/core/services/menu.service';
import { ServiceSliderImage } from 'src/app/core/services/slider-image.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceStatus } from 'src/app/core/services/status.service';

@Component({
  selector: 'app-modal-add-slider-images',
  templateUrl: './modal-add-slider-images.component.html',
  styleUrls: ['./modal-add-slider-images.component.css']
})
export class ModalAddSliderImagesComponent implements OnInit {

  /* SLIDER IMAGE FORM */
  sliderImageForm: FormGroup;

  /* ENABLED / DISABLED LIST */
  statusList: ModelStatus[];

  /* FORM SUBMISSION */
  isSubmitting: boolean;
  isLoading: boolean;

  // APP TYPE LIST 
  appTypeList: appTypeId[];
  categoryList: Dropdown[];
  selectedAppType;

  /* IMAGE FORM */
  imageForm: FormGroup;
  imageId: number;
  imageName: string;
  imageUrl: string;
  category:FormControl
  imageUploaded: boolean = false;

  /* FOR UPDATING EXISTING SLIDER IMAGE */
  currentSliderImage: SliderImageResponse;

  selectedRestaurant: Restaurant;


  constructor(
    private dialogRef: MatDialogRef<ModalAddSliderImagesComponent>,
    private discountCouponService: ServiceDiscountCoupon,
    private sliderImageService: ServiceSliderImage,
    private snackBarService: ServiceSnackbar,
    private statusService: ServiceStatus,
    private languageService: ServiceLanguage,
    private menuService: ServiceMenu,
    private authService: ServiceAuth,
    @Inject(MAT_DIALOG_DATA) public modalData: {
      sliderImage: SliderImageResponse
    },
  ) { }

  ngOnInit(): void {

    this.selectedRestaurant = {
      id: this.authService.getRestaurantId(),
      title: this.authService.getRestaurantName()
    }

    this.authService.restaurantChanged.subscribe(
      (response: Restaurant) => {
        this.selectedRestaurant = response;
      }
    );

    this.getAppTypeList();
    
    this.statusList = this.statusService.getEnableDisabledStatuses();
    console.log("this.modalData.sliderImage")
    console.log(this.modalData.sliderImage)
    this.sliderImageForm = new FormGroup({
      isMainPage: new FormControl(false, Validators.required,),
      sortOrder: new FormControl(null,),
      status: new FormControl(null, Validators.required),
      appTypeId: new FormControl(this.modalData.sliderImage?.appType.id),
     category: new FormControl( ),
    });
    this.getMenuCategory();
    this.selectedAppType = this.modalData.sliderImage?.appType.id;
    this.imageForm = new FormGroup({
      fileName: new FormControl(null, Validators.required),
      imageId: new FormControl(null)
    });


    if (this.modalData.sliderImage != null) {

      // this.selectedFranchises = this.modalData.sliderImage.hqList.map(x => x.id);
      this.currentSliderImage = this.modalData.sliderImage;
      debugger
      //SETTING FORM DETAILS.
      
      this.sliderImageForm.controls.sortOrder.setValue(this.currentSliderImage.sortOrder);
      let statusId = this.statusList.find((status) => status.title == this.modalData.sliderImage.status).id;
      this.sliderImageForm.controls.status.setValue(statusId);
      this.sliderImageForm.controls.isMainPage.setValue(this.currentSliderImage.mainPage);

      //SETTING IMAGE FORM.
      this.imageForm.controls.imageId.setValue(0);
      
      this.imageForm.controls.fileName.setValue(this.currentSliderImage.fileName);
      this.imageUrl = this.currentSliderImage.fileUrl;
      console.log("this.sliderImageForm")
      console.log(this.sliderImageForm)

    }

  }
  getMenuCategory(){
    this.menuService.menuCatgoryDropDown( this.selectedRestaurant.id, this.languageService.getCurrentLanguage().id).subscribe(
      (response: Dropdown[]) => { 
        this.categoryList = response;
        // i
        if(this.modalData.sliderImage){
        if(this.modalData.sliderImage.navigationPath){
          let i=  this.categoryList.find((element)=> element.title.toString().toLowerCase().trim()==this.modalData.sliderImage.navigationPath.toString().toLowerCase().trim())
         console.log(i)
          this.sliderImageForm.controls.category.setValue(i)
         }
      }}
    );
  }

  getAppTypeList() {
    /* FETCH APP TYPE LIST */
    this.isLoading = true;
    this.discountCouponService.getAppTypesList().subscribe(
      (data: appTypeId[]) => {
        this.appTypeList = data;
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    let request: SliderImageRequest = {
      imgId: this.imageForm.controls.imageId.value,
      navigationPath:this.sliderImageForm.controls.category.value.title,
      status: {
        id: this.sliderImageForm.controls.status.value
      },
      fileName: this.imageForm.controls.fileName.value,
      isMainPage: this.sliderImageForm.controls.isMainPage.value,
      sortOrder: this.sliderImageForm.controls.sortOrder.value,
      restaurantId: this.selectedRestaurant.id,
      appType: {
        id: this.selectedAppType,
      }
    }
    console.log('slider request');
    console.log(request);
    this.isSubmitting = true;

    if (this.currentSliderImage == null) {
      this.sliderImageService.addUpdateSliderImage(request).subscribe(
        (response) => {
          this.snackBarService.showSuccessMessage("Successfully Added a Slider Image!");
          this.sliderImageService.dataUpdated.emit();
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackBarService.showErrorMessage("Error Adding Slider Image!");
          this.isSubmitting = false;
        }
      );
    }
    else {
      request.id = this.currentSliderImage.id;
      console.log(request)
      console.log(JSON.stringify(request))
      this.sliderImageService.addUpdateSliderImage(request).subscribe(
        (response) => {
          console.log("response")
          console.log(response)
          this.snackBarService.showSuccessMessage("Successfully Updated Slider Image!");
          this.sliderImageService.dataUpdated.emit();
          this.dialogRef.close(true);
        },
        (error: HttpErrorResponse) => {
          if (error.status == 200) {
            this.snackBarService.showSuccessMessage("Successfully Updated Slider Image!");
            this.sliderImageService.dataUpdated.emit();
            this.dialogRef.close(true);
          } else {
            console.log("error")
            console.log(error)
            this.snackBarService.showErrorMessage("Error Updating Slider Image! Try again.");
            this.isSubmitting = false;
          }
        }
      );

    }

  }

  /* ON IMAGE UPLOADED */
  onImageUploaded(event: ModelImage) {
    console.log(event)
    this.imageUploaded = true;
    this.imageId = event.imageId;
    this.imageUrl = event.fileUrl;
    this.imageName = event.fileName;
    this.imageForm.controls.fileName.setValue(event.fileName);
    this.imageForm.controls.imageId.setValue(event.imageId);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

}

class appTypeId {
  id: number;
  code?: string;
  name: string;
}