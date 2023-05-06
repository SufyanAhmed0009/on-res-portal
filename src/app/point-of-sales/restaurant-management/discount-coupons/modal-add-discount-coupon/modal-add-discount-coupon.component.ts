import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CouponRanges, ModalDiscCouponNewRequest, ModalDiscCouponNewResponse } from 'src/app/core/models/discount-coupon';
import { ModelImage } from 'src/app/core/models/image';
import { DtPageInfo } from 'src/app/core/models/page';
import { ModelStatus } from 'src/app/core/models/restaurant-menu';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceRestaurant } from 'src/app/core/services/restaurant.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceStatus } from 'src/app/core/services/status.service';

@Component({
  selector: 'app-modal-add-discount-coupon',
  templateUrl: './modal-add-discount-coupon.component.html',
  styleUrls: ['./modal-add-discount-coupon.component.css']
})
export class ModalAddDiscountCouponComponent implements OnInit {

  discountCouponForm: FormGroup;
  dateInput: Date;
  isSubmitted: boolean;

  /* IS DISCOUNT IN PERCENTAGE */
  discInPercent: boolean;

  /* IMAGE UPLOAD */
  uploadedImageUrl: string;

  /* FRANCHISES */
  selectedFranchises: number[] = [];

  /* DISCOUNT COUPON TYPES */
  couponTypesList: CouponTypes[];
  selectedCouponType: number;
  couponRanges: CouponRanges[] = [];
  appTypesList: appTypeId[];
  selectedAppType: number;

  statusList: ModelStatus[];

  /* RESTAURANTS */
  restaurants: DtSelectItem[] = [];
  selectedRestaurants: number[] = [];
  restRequest: DtPageInfo;
  allowedRestaurants: number[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { pageTitle: String; coupon: ModalDiscCouponNewResponse },
    public dialogRef: MatDialogRef<ModalAddDiscountCouponComponent>,
    private discountCouponService: ServiceDiscountCoupon,
    private snackBarService: ServiceSnackbar,
    private statusService: ServiceStatus,
    private restaurantService: ServiceRestaurant,
    private authService: ServiceAuth,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    console.log("this.coupon")
    console.log(this.data.coupon)
    this.dateInput = new Date();
    this.statusList = this.statusService.getEnableDisabledStatuses();

    this.allowedRestaurants = this.authService.getUserRestaurantList();
    console.log("this.allowedRestaurants")
    console.log(this.allowedRestaurants)
  
    /* FETCH COUPON TYPE LIST */
    this.discountCouponService.getCouponTypesList().subscribe(
      (data: CouponTypes[]) => {
        this.couponTypesList = data;
        console.log("this.couponTypesList")
        console.log(this.couponTypesList)
      }
    )
    /* FETCH APP TYPE LIST */
    this.discountCouponService.getAppTypesList().subscribe(
      (data: appTypeId[]) => {
        this.appTypesList = data;
        // console.log("this.appTypesList")
        // console.log(this.appTypesList);
      }
    );


    this.restRequest = {
      restIds: []
    }
    console.log("this.restRequest")
    console.log(this.restRequest)
    this.restaurantService.getRestaurantList(this.restRequest).subscribe(
      (response: DtSelectItem[]) => {
        console.log("restaurant")
        console.log(response)
        this.restaurants = response;
        this.restaurants = this.restaurants.filter(x => this.allowedRestaurants.includes(x.id));
        console.log("this.restaurants")
        console.log(this.restaurants)
      }
    );

    this.discInPercent = true;
    this.discountCouponForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'details': new FormControl(null, Validators.required),
      'startingDate': new FormControl(new Date(), Validators.required),
      'expiryDate': new FormControl(new Date(), Validators.required),
      'retargettedDate': new FormControl(new Date(), Validators.required),
      'fileName': new FormControl(null),
      'imgId': new FormControl(null),
      'percentage': new FormControl(0),
      'additionalPercentage': new FormControl(0),
      'fixedAmount': new FormControl(0),
      'promocode': new FormControl(null, Validators.required),
      'minOrderValue': new FormControl(null, Validators.required),
      'totalVouchers': new FormControl(100),
      // 'totalVouchersIssued': new FormControl(0, Validators.required),
      'totalVouchersIssued': new FormControl(0),
      'orderCountCoupon': new FormControl(null),
      'isShowNotif': new FormControl(true),
      'excludeShopkeeper': new FormControl(false),
      'usageLimitPerCustomer': new FormControl(0),
      'maxAmountPerUse': new FormControl(0),
      'status': new FormControl(true, Validators.required),
      'expiryTime': new FormControl(null,),
      'isAutoApply': new FormControl(false),
      'restrictDevice': new FormControl(false),
    });

    if (this.data.coupon != null) {
      this.selectedCouponType = this.data.coupon.type ? this.data.coupon.type.id : null;
      let expiryTime = this.datePipe.transform(this.data.coupon.expiryDate, "HH:mm:ss")
      this.discountCouponForm.controls.title.setValue(this.data.coupon.title);
      this.discountCouponForm.controls.details.setValue(this.data.coupon.details);
      this.discountCouponForm.controls.startingDate.setValue(new Date(this.data.coupon.startingDate));
      this.discountCouponForm.controls.expiryDate.setValue(new Date(this.data.coupon.expiryDate));
      this.discountCouponForm.controls.retargettedDate.setValue(new Date(this.data.coupon.retargettedDate));
      this.discountCouponForm.controls.fileName.setValue(this.data.coupon.fileUrl);
      this.discountCouponForm.controls.imgId.setValue(this.data.coupon);
      this.discountCouponForm.controls.percentage.setValue(this.data.coupon.percentage);
      this.discountCouponForm.controls.additionalPercentage.setValue(this.data.coupon.additionalPercentage);
      this.discountCouponForm.controls.fixedAmount.setValue(this.data.coupon.fixedAmount);
      this.discountCouponForm.controls.promocode.setValue(this.data.coupon.promocode);
      this.discountCouponForm.controls.minOrderValue.setValue(this.data.coupon.minOrderValue);
      this.discountCouponForm.controls.totalVouchers.setValue(this.data.coupon.totalVouchers);
      this.discountCouponForm.controls.totalVouchersIssued.setValue(this.data.coupon.totalVouchersIssued);
      this.discountCouponForm.controls.orderCountCoupon.setValue(this.data.coupon.orderCountCoupon);
      this.discountCouponForm.controls.isShowNotif.setValue(this.data.coupon.isShowNotif);
      this.discountCouponForm.controls.excludeShopkeeper.setValue(this.data.coupon.excludeShopkeeper);
      this.discountCouponForm.controls.usageLimitPerCustomer.setValue(this.data.coupon.usageLimitPerCustomer);
      this.discountCouponForm.controls.maxAmountPerUse.setValue(this.data.coupon.maxAmountPerUse);
      this.discountCouponForm.controls.status.setValue(this.data.coupon.status?.id);
      this.discountCouponForm.controls.expiryTime.setValue(expiryTime);
      this.discountCouponForm.controls.isAutoApply.setValue(this.data.coupon.autoApply);
      this.discountCouponForm.controls.restrictDevice.setValue(this.data.coupon.restrictDevice);
      this.uploadedImageUrl = this.data.coupon.fileUrl;

      this.selectedCouponType = this.data.coupon.type ? this.data.coupon.type.id : null;
      this.selectedAppType = this.data.coupon.appType?.id;
      this.onTypeChange();
      this.couponRanges = this.data.coupon.couponRange;
      this.data.coupon.discountCouponRestaurant.map(
        (item)=>{
          this.selectedRestaurants.push(item.restaurantId);
        }
      );
      console.log("this.selectedRestaurants")
      console.log(this.selectedRestaurants)
    }
  }

  /* Discount in Percentage or in Fixed Amount Toggle*/
  onToggleChange() {
    if (this.discInPercent) {
      this.discountCouponForm.controls.percentage.enable();
      this.discountCouponForm.controls.fixedAmount.disable();
    } else {
      this.discountCouponForm.controls.fixedAmount.enable();
      this.discountCouponForm.controls.percentage.disable();
    }
  }

  /* On Change Coupon Type */
  onTypeChange() {
    if (this.selectedCouponType != 1 && this.selectedCouponType != 4 && this.selectedCouponType != 5 && this.selectedCouponType != 7 && this.selectedCouponType != 8) {
      this.discountCouponForm.controls.percentage.disable();
      this.discountCouponForm.controls.fixedAmount.disable();
    } else {
      this.discountCouponForm.controls.percentage.enable();
      this.discountCouponForm.controls.fixedAmount.enable();
    }
    if (this.selectedCouponType == 2 || this.selectedCouponType == 4 || this.selectedCouponType == 5 || this.selectedCouponType == 7) {
      this.discountCouponForm.controls.totalVouchers.enable();
      this.discountCouponForm.controls.totalVouchersIssued.enable();
      this.discountCouponForm.controls.orderCountCoupon.enable();
    } else {
      this.discountCouponForm.controls.totalVouchers.disable();
      this.discountCouponForm.controls.totalVouchersIssued.disable();
      this.discountCouponForm.controls.orderCountCoupon.disable();
    }
    if (this.selectedCouponType == 1 || this.selectedCouponType == 8) {
      this.discountCouponForm.controls.totalVouchers.enable();
      this.discountCouponForm.controls.orderCountCoupon.enable();
    }
    if (this.selectedCouponType == 7) {
      this.discountCouponForm.controls.retargettedDate.enable();
    }
    else {
      this.discountCouponForm.controls.retargettedDate.disable();
    }
  }


  /* ON IMAGE UPLOAD */
  onImageUpload(data: ModelImage) {
    this.uploadedImageUrl = data.fileUrl;
    this.discountCouponForm.controls.fileName.setValue(data.fileName);
    this.discountCouponForm.controls.imgId.setValue(data.imageId);
  }

  /* FOR DISCOUNT RANGES */
  addDiscountRange() {
    this.couponRanges.push({
      startRange: this.couponRanges.length == 0 ? 0 : this.couponRanges[this.couponRanges.length - 1].endRange + 1,
      endRange: 99999,
      percentage: 0,
      fixedAmount: 0
    });
  }
  removeDiscountRange(index: number) {
    this.couponRanges.splice(index, 1);
  }

  /* ON SUBMIT */
  onAddCoupon() {
    let data: CouponFormData = this.discountCouponForm.value;
    let flag1 = 0;
    let flag2 = 0;

    this.couponRanges?.map(
      (item) => {
        item.percentage = this.discInPercent ? item.percentage : 0
        item.fixedAmount = !this.discInPercent ? item.fixedAmount : 0
        item.endRange < item.startRange ? flag1++ : 0
        !item.percentage && !item.fixedAmount ? flag2++ : 0
      }
    );

    if (flag1 > 0) {
      this.snackBarService.showErrorMessage("Invalid Range!")
    }
    else if (flag2 > 0) {
      this.snackBarService.showErrorMessage("Discount Amount Field is Empty!")
    }

    else {

      console.log("this.selectedAppType")
      console.log(this.selectedAppType)
      let request: ModalDiscCouponNewRequest = {
        promocode: data.promocode,
        expiryDate: this.datePipe.transform(data.expiryDate, "yyyy-MM-dd"),
        startingDate: this.datePipe.transform(data.startingDate, "yyyy-MM-dd"),
        title: data.title,
        details: data.details,
        percentage: this.discInPercent ? data.percentage : 0,
        additionalPercentage: this.discInPercent ? data.additionalPercentage : 0,
        fixedAmount: !this.discInPercent ? data.fixedAmount : 0,
        orderCouponCount: data.orderCountCoupon,
        retargettedDate: this.datePipe.transform(data.retargettedDate, "yyyy-MM-dd"),
        isShowNotif: data.isShowNotif,
        excludeShopkeeper: data.excludeShopkeeper,
        imgId: this.data.coupon == null ? data.imgId : null,
        statusId: data.status,
        couponTypeId: this.selectedCouponType.toString(),
        appTypeId: this.selectedAppType.toString(), // remove it from backend
        totalVouchersIssued: data.totalVouchersIssued,
        totalVouchers: data.totalVouchers,
        minOrderValue: data.minOrderValue,
        usageLimitPerCustomer: this.selectedCouponType == 4 || this.selectedCouponType == 2 || this.selectedCouponType == 5 || this.selectedCouponType == 7 ? data.usageLimitPerCustomer : null,
        maxAmountPerUse: this.selectedCouponType == 4 || this.selectedCouponType == 2 || this.selectedCouponType == 5 || this.selectedCouponType == 7 ? data.maxAmountPerUse : null,
        couponRanges: this.couponRanges ? this.couponRanges : null,
        userRestIds: this.selectedRestaurants,
        autoApply: data.isAutoApply,
        restrictDevice: data.restrictDevice
      }


      if (this.data.pageTitle == 'ADD' || this.data.pageTitle == 'COPY') {

        /* CONCATENATING EXPIRY DATE AND EXPIRY TIME */
        // console.log("new expiryDate")
        // console.log(expiryDateTime)

        console.log("request")
        console.log(request)
        console.log(JSON.stringify(request))

        this.isSubmitted = true;
        this.discountCouponService.addDiscountCoupon(request).subscribe(
          (response) => {
            this.snackBarService.showSuccessMessage("Successfully Added Coupon");

            this.discountCouponService.dataUpdated.emit();
            this.dialogRef.close();
          },
          (error: HttpErrorResponse) => {
            if (error.status == 200) {
              this.snackBarService.showSuccessMessage("Successfully Added Coupon");
              this.discountCouponService.dataUpdated.emit();
              this.dialogRef.close();
            }
            else {
              this.snackBarService.showErrorMessage("Error Adding Coupon");
              this.discountCouponService.dataUpdated.emit();
              this.isSubmitted = false;
            }
          }
        );

      } else {

        request.discountCouponId = this.data.coupon.id;
        console.log("request")
        console.log(request)
        console.log(JSON.stringify(request))
        this.isSubmitted = true;
        this.discountCouponService.updateDiscountCoupon(request).subscribe(
          (response) => {
            this.snackBarService.showSuccessMessage("Successfully Updated Coupon");
            this.discountCouponService.dataUpdated.emit();
            this.dialogRef.close();
          },
          (error: HttpErrorResponse) => {
            if (error.status == 200) {
              this.snackBarService.showSuccessMessage("Successfully Updated Coupon");
              this.discountCouponService.dataUpdated.emit();
              this.dialogRef.close();
            }
            else {
              this.snackBarService.showErrorMessage("Error Updating Coupon");
              this.isSubmitted = false;
            }
          }
        );
      }
    }

  }

  selectAllRestaurants() {
    this.selectedRestaurants = this.restaurants.map(x => x.id);
  }

  deselectAllRestaurants() {
    this.selectedRestaurants = null;
  }

  onClose() {
    this.dialogRef.close();
  }

}

class CouponFormData {
  title: string;
  details: string;
  startingDate: Date;
  expiryDate: Date;
  fileName?: string;
  fileUrl: string;
  percentage: number;
  additionalPercentage: number;
  fixedAmount: number;
  promocode: string;
  usageLimitPerCustomer?: number;
  maxAmountPerUse?: number;
  minOrderValue: number;
  userGroupId: number;
  totalVouchers: number;
  totalVouchersIssued: number;
  orderCountCoupon?: number;
  retargettedDate: Date;
  isShowNotif: boolean;
  excludeShopkeeper: boolean;
  hqList: number[];
  imgId?: number;
  status: number;
  expiryTime: string;
  isAutoApply: boolean;
  restrictDevice: boolean;
  appTypeId: string;
}

class CouponTypes {
  id: number;
  code?: string;
  title: string;
}

class appTypeId {
  id: number;
  code?: string;
  name: string;
}

class Hq {
  id: number;
}
