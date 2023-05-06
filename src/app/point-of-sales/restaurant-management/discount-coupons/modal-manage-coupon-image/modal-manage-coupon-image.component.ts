import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelDiscountCouponRequest, ModelDiscountCouponResponse } from 'src/app/core/models/discount-coupon';
import { ModelImage } from 'src/app/core/models/image';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-modal-manage-coupon-image',
  templateUrl: './modal-manage-coupon-image.component.html',
  styleUrls: ['./modal-manage-coupon-image.component.css']
})
export class ModalManageCouponImageComponent implements OnInit {

  imageId: number;
  imageName: string;
  imageUrl: string;
  isUpdated: boolean;
  isSubmitted: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public coupon: ModelDiscountCouponResponse,
    private discountCouponService: ServiceDiscountCoupon,
    private dialogRef: MatDialogRef<ModalManageCouponImageComponent>,
    private snackBarService: ServiceSnackbar,

  ) { }

  ngOnInit(): void {

    this.isUpdated = false;
    this.isSubmitted = false;
    this.imageUrl = this.coupon.fileUrl;
    this.imageName = this.coupon.fileName;

  }

  onUpload(event: ModelImage) {
    this.isUpdated = true;
    this.imageId = event.imageId;
    this.imageName = event.fileName;
    this.imageUrl = event.fileUrl;
  }

  onSubmit() {

    
    let request: ModelDiscountCouponRequest = {
      discountCouponLanguage: {
        title: this.coupon.title,
        details: this.coupon.details
      },
      status: {
        id: 3
      },
      discountCoupon: {
        id: this.coupon.id,
        code: this.coupon.code,
        expiryDate: new Date(this.coupon.expiryDate),
        startingDate: new Date(this.coupon.startingDate),
        fileName: this.imageName,
        percentage: this.coupon.percentage,
        promocode: this.coupon.promocode,
        maxAmountPerUse: this.coupon.maxAmountPerUse,
        minOrderValue: this.coupon.minOrderValue,
        maxOrderValue: this.coupon.maxOrderValue,
        totalVouchers: this.coupon.totalVouchers,
        validity: this.coupon.validity
      },
      userGroupId: null,
      imgId: this.isUpdated ? this.imageId : 0
    }
    
    this.isSubmitted = true;
    this.discountCouponService.updateDiscountCouponOld(request).subscribe(
      (response) => {
        this.snackBarService.showSuccessMessage("Image Updated Successfully!");
        this.dialogRef.close();
      },
      (error) => {
        this.snackBarService.showErrorMessage("Error Updating Image!");
        this.isSubmitted = false;
      }
    );

  }

  onClose(){
    this.dialogRef.close();
  }

}

