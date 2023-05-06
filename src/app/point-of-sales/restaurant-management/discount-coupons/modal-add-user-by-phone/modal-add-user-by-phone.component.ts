import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectorCountry } from 'src/app/core/models/country';
import { ModelDiscountCouponResponse } from 'src/app/core/models/discount-coupon';
import { MembershipCouponRequest } from 'src/app/core/models/user-app';
import { ServiceCountry } from 'src/app/core/services/country.service';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-modal-add-user-by-phone',
  templateUrl: './modal-add-user-by-phone.component.html',
  styleUrls: ['./modal-add-user-by-phone.component.css']
})
export class ModalAddUserByPhoneComponent implements OnInit {

  isLoading = false;
  addUserForm: FormGroup;
  expirydate = new FormControl(new Date(new Date().setDate(new Date().getDate() + 7)));
  countryList: SelectorCountry[] = [];
  selectedCountryId: number;
  selectedCountryCode: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { coupon: ModelDiscountCouponResponse },
    private dialogRef: MatDialogRef<ModalAddUserByPhoneComponent>,
    private discountCouponService: ServiceDiscountCoupon,
    private snackBarService: ServiceSnackbar,
    private countryService: ServiceCountry,
  ) { }

  ngOnInit() {

    /* COUNTRY LIST SERVICE */
    this.countryService.getListOfCountries().subscribe(
      (response: SelectorCountry[]) => {
        this.countryList = response;
      }
    )
    this.addUserForm = new FormGroup({
      'phoneInput': new FormControl(null, Validators.required),
      'MaxAmount': new FormControl(0, Validators.required),
      'TotalUsage': new FormControl(0, Validators.required),
      'startingDate': new FormControl(new Date(), Validators.required),
      'expiryDate': new FormControl(this.expirydate.value, Validators.required),
      // 'expiryTime': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
    });

  }

  onSelectCountry(event) {
    this.selectedCountryId = event.value;
    this.selectedCountryCode = this.countryList.find((x) => x.id == this.selectedCountryId).code;
  }

  onAddByPhone() {

    let request: MembershipCouponRequest = {
      phone: this.addUserForm.controls.phoneInput.value,
      countryId: this.addUserForm.controls.country.value,
      couponId: this.data.coupon.id,
      couponTotalUsage: this.addUserForm.controls.TotalUsage.value,
      couponMaxAmount: this.addUserForm.controls.MaxAmount.value,
      couponUsageTime: true,
      couponStartingDate: formatDate(this.addUserForm.controls.startingDate.value, 'yyyy-MM-dd HH:mm:ss.SSS', 'en-US'),
      couponExpiryDate: formatDate(this.expirydate.value, 'yyyy-MM-dd HH:mm:ss.SSS', 'en-US')
    }
    console.log("request")
    console.log(JSON.stringify(request))
    this.isLoading = true;

    this.discountCouponService.addNewUser1(request).subscribe(
      (response: { code: number }) => {
        console.log("response")
        console.log(response)
        this.isLoading = false;
        if (response?.code == 0) {
          this.snackBarService.showErrorMessage("User Not Found!");
        } else if (response?.code == 1) {
          this.snackBarService.showErrorMessage("Coupon Already Assigned!");
        } else if (response?.code == 2) {
          this.snackBarService.showSuccessMessage("Successfully assigned coupon!");
          this.dialogRef.close();
        } else {
          this.snackBarService.showErrorMessage("Can't Assign User! Invalid or expired coupon!");
        }
      },
      (error) => {
        this.snackBarService.showErrorMessage("Unknown error occured!");
        this.isLoading = false;
        console.error(error);
      }
    );

  }
}

