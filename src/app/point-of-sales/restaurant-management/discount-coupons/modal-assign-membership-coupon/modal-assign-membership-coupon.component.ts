import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelDiscountCouponResponse } from 'src/app/core/models/discount-coupon';
import { MembershipCouponRequest, ModelMembershipInfo } from 'src/app/core/models/user-app';
import { ServiceAppUsers } from 'src/app/core/services/app-users.service';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-modal-assign-membership-coupon',
  templateUrl: './modal-assign-membership-coupon.component.html',
  styleUrls: ['./modal-assign-membership-coupon.component.css']
})
export class ModalAssignMembershipCouponComponent implements OnInit {
  isLoading = false;
  addUserForm: FormGroup;
  userMemberships: any;
  membershipID: number;
  date = new FormControl(new Date(new Date().setDate(new Date().getDate() + 7)));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { coupon: ModelDiscountCouponResponse },
    private dialogRef: MatDialogRef<ModalAssignMembershipCouponComponent>, private discountCouponService: ServiceDiscountCoupon,
    private snackBarService: ServiceSnackbar,
    private appUsersService: ServiceAppUsers
    ) { }

  ngOnInit() {

    this.appUsersService.getAppUsersMembershipTypes(null).subscribe(
      (response: ModelMembershipInfo[]) => {
        this.userMemberships = response;
      }),
      this.addUserForm = new FormGroup({
        'Membership': new FormControl(null, Validators.required),
        'phoneInput': new FormControl(null, Validators.required),
        'MaxAmount': new FormControl(0, Validators.required),
        'TotalUsage': new FormControl(0, Validators.required),
        'startingDate': new FormControl(new Date(), Validators.required),
        'expiryDate': new FormControl(this.date.value, Validators.required),
      });

  }

  onSelect(membership: ModelMembershipInfo) {
    this.membershipID = membership.id;
  }

  onAddMembershipCoupon() {
    let request: MembershipCouponRequest = {
      membershipId: this.membershipID,
      couponId: this.data.coupon.id,
      couponTotalUsage: this.addUserForm.controls.TotalUsage.value,
      couponMaxAmount: this.addUserForm.controls.MaxAmount.value,
      couponUsageTime: true,
      couponStartingDate: formatDate(this.addUserForm.controls.startingDate.value, 'yyyy-MM-dd HH:mm:ss.SSS', 'en-US'),
      couponExpiryDate: formatDate(this.date.value, 'yyyy-MM-dd HH:mm:ss.SSS', 'en-US')
    }
    console.log("request")
    console.log(JSON.stringify(request))

    this.isLoading = true;
    this.discountCouponService.membershipCoupon(request).subscribe(
      (response: { code: number }) => {
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
