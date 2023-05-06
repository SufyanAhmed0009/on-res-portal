import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelNotificationsResponse, ModelNotificationUpdateRequest } from 'src/app/core/models/notification';
import { ModelStatus } from 'src/app/core/models/restaurant-menu';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceNotification } from 'src/app/core/services/notification.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceStatus } from 'src/app/core/services/status.service';

@Component({
  selector: 'app-modal-edit-notification',
  templateUrl: './modal-edit-notification.component.html',
  styleUrls: ['./modal-edit-notification.component.css']
})
export class ModalEditNotificationComponent implements OnInit {

  isSubmitting: boolean;
  updateForm: FormGroup;
  statusList: ModelStatus[];

  // APP TYPE LIST 
  appTypesList: appTypeId[];
  selectedAppType;

  constructor(
    @Inject(MAT_DIALOG_DATA) private notification: ModelNotificationsResponse,
    private statusService: ServiceStatus,
    private dialogRef: MatDialogRef<ModalEditNotificationComponent>,
    private languageService: ServiceLanguage,
    private snackBarService: ServiceSnackbar,

    private notificationsService: ServiceNotification,
    private discountCouponService: ServiceDiscountCoupon,
  ) { }

  ngOnInit(): void {
    console.log("this.notification")
    console.log(this.notification)
    this.statusList = this.statusService.getEnableDisabledStatuses();
    this.updateForm = new FormGroup({
      title: new FormControl(this.notification.title, Validators.required),
      details: new FormControl(this.notification.details, Validators.required),
      status: new FormControl(3),
      appTypeId: new FormControl(this.notification.appType?.id),
    });
    this.selectedAppType = this.notification.appType?.id;
    /* FETCH APP TYPE LIST */
    this.discountCouponService.getAppTypesList().subscribe(
      (data: appTypeId[]) => {
        this.appTypesList = data;
        // console.log("this.appTypesList")
        // console.log(this.appTypesList);
      }
    )
  }

  onSubmit() {
    this.isSubmitting = true;
    let request: ModelNotificationUpdateRequest = {
      id: this.notification.id,
      title: this.updateForm.value.title,
      description: this.updateForm.value.details,
      statusId: this.updateForm.value.status,
      langId: this.languageService.getCurrentLanguage().id,
      appTypeId: this.selectedAppType,
    }
    console.log("request")
    console.log(request)
    this.notificationsService.updateNotification(request).subscribe(
      (success) => {
        console.log('response', success);
        this.snackBarService.showSuccessMessage("Updated Successfully!");
   
        this.dialogRef.close(true);
      },
      (error) => {
        this.snackBarService.showErrorMessage("Error Updating.");
       
        this.isSubmitting = false;
      }
    );
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