import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModelNotificationRequest } from 'src/app/core/models/notification';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceNotification } from 'src/app/core/services/notification.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import * as moment from 'moment';
import { ModalUserSheetUploadComponent } from '../modal-user-sheet-upload/modal-user-sheet-upload.component';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-modal-create-notification',
  templateUrl: './modal-create-notification.component.html',
  styleUrls: ['./modal-create-notification.component.css']
})
export class ModalCreateNotificationComponent implements OnInit {

  notificationForm: FormGroup;

  /* NOTIFICATION TYPES */
  notificationTypes: PrivateDropDownItem[];

  /* NOTIFICATION AUDIENCE */
  audienceTypes: PrivateDropDownItem[];
  notifReach: string;
  enableUserSelection: boolean;

  // APP TYPE LIST 
  appTypesList: appTypeId[];
  selectedAppType;

  /* SELECTED CUSTOMERS LIST */
  selectedCustomersList: PrivateDropDownItem[] = [];

  /* LOADER */
  isSubmitting: boolean;

  /* EXPIRY DATE */
  expiryDate: Date;

  /* FRANCHISES */
  selectedFranchises: number[] = [];

  /* IMAGE */
  imageId: number;
  imageUrl: string;
  isImageUrl: boolean = false;
  imagePath: string;

  concatString: any;

  /* EXCEL SHEET LIST */
  sheetData: [] = [];

  constructor(
    private dialogRef: MatDialogRef<ModalCreateNotificationComponent>,
    private notificationService: ServiceNotification,
    private discountCouponService: ServiceDiscountCoupon,
    private snackBarService: ServiceSnackbar,
    private languageService: ServiceLanguage,
    private datePipe: DatePipe,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {

    // FOR SELECTING USERS..
    this.enableUserSelection = true;
    this.notifReach = 'S';

    this.expiryDate = new Date();


    this.notificationTypes = [
      { code: 'N', title: 'News' },
      { code: 'A', title: 'Announcement' }
    ];

    this.audienceTypes = [
      { code: 'A', title: 'All' },
      { code: 'S', title: 'Selected' }
    ]

    this.notificationForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'details': new FormControl(null, Validators.required),
      'notifType': new FormControl('N'),
      'sendNotif': new FormControl(false),
      'popUp': new FormControl(true),
      'appTypeId': new FormControl(null),
      'openingTime': new FormControl(null),
      'todayDate': new FormControl(null),
      // 'sendDate':new FormControl(null)
    });

    /* FETCH APP TYPE LIST */
    this.discountCouponService.getAppTypesList().subscribe(
      (data: appTypeId[]) => {
        this.appTypesList = data;
        // console.log("this.appTypesList")
        // console.log(this.appTypesList);
      }
    )

  }

  onAudienceChange(event: any) {
    if (event.value == 'S') {
      this.enableUserSelection = true;
    } else {
      this.enableUserSelection = false;
    }
  }
  changeTime() {
    let openingTime = moment(this.notificationForm.value.openingTime, "hh:mm")
    console.log(openingTime.utc());
    console.log((openingTime).format('LLL'));
    return openingTime;
  }

  onSubmit() {

    let opTime = [...Array(48)].map((e, i) => {
      return (i / 2 < 10 ? '0' : '') + (i / 2 - i / 2 % 1) + (i / 2 % 1 != 0 ? ':30' : ':00');
    });
    console.log(opTime);

    //let formValues: FormValues = this.notificationForm.value;
    console.log("openingTime", this.notificationForm.value.openingTime)

    if (this.notificationForm.value.sendNotif == false) {
      if (!(opTime.includes(this.notificationForm.value.openingTime))
      ) {
        this.snackBarService.showErrorMessage("Incorrect Time!");
        return;
      }

    }

    console.log(this.notificationForm.value.todayDate)
    let time = moment(this.notificationForm.value.openingTime, "HH:mm")
    let time_utc = time.utc();
    console.log((time_utc).format('HH:mm:ss'));
    console.log("time", time)
    console.log("time_utc", time_utc)

    if (this.notificationForm.value.todayDate != null) {
      this.concatString = this.notificationForm.value.todayDate.concat(" " + time_utc.format('HH:mm:ss'))
      console.log(this.concatString)
    } else this.concatString == ''
 


    let request: ModelNotificationRequest = {
      // ...formValues,
      title: this.notificationForm.value.title,
      details: this.notificationForm.value.details,
      notifType: this.notificationForm.value.notifType,
      sendNotif: this.notificationForm.value.sendNotif,
      popUp: this.notificationForm.value.popUp,
      // sendDate:this.datePipe.transform(concatString,"yyyy-MM-dd HH:mm:ss"),
      sendDate: this.concatString,
      notifReach: this.notifReach,
      userIds: [],
      langId: this.languageService.getCurrentLanguage().id,
      imgId: this.imageId,
      imgUrl: this.imageUrl,
      langCode: 'LANG0001',
      expiryDate: this.datePipe.transform(this.expiryDate, "yyyy-MM-dd HH:mm:ss"),
      hqIds: this.selectedFranchises,
      appTypeId: this.selectedAppType,
    }
    console.log(request)

    if (this.notifReach == 'S') {
      request.userIds = this.selectedCustomersList.map(
        (item) => {
          return item.id;
        }
      )
    }
    console.log("request")
    console.log(request)
    console.log(JSON.stringify(request))
    this.isSubmitting = true;
    this.notificationService.createNotification(request).subscribe(
      (response) => {
        this.snackBarService.showSuccessMessage("Notification Created Successfully!");
        this.notificationService.dataUpdated.emit();
        this.dialogRef.close(true);
      },
      (error) => {
        console.error(error);
        this.snackBarService.showErrorMessage("Error Creating Notification!");
        this.isSubmitting = false;
      }
    );


  }

  /* ON SELECTING STORE */
  onUserSelected(user: DtSelectItem) {
    this.selectedCustomersList.push(user);
  }

  removeCustomer(index: number) {
    this.selectedCustomersList.splice(index, 1);
  }

  onImageUpload(event: { imageId: number, fileName: string, fileUrl: string }) {
    this.imageUrl = event.fileUrl;
    this.imageId = event.imageId;
  }

  /* ON USER SHEET UPLOAD */
  onExcelUpload() {
    this.matDialog.open(ModalUserSheetUploadComponent, {
      width: '500px',
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    }).afterClosed()
      .subscribe(response => {
        this.sheetData = response;
        if (this.sheetData != null) {
          this.sheetData.forEach((element) => {
            this.selectedCustomersList.push(element)
          });
        }
      });
  }
}

class PrivateDropDownItem {
  id?: number;
  code?: string;
  title?: string;
}

class FormValues {
  title: string;
  details: string;
  notifType: string;
  sendNotif: boolean;
  popUp: boolean;
  // openingTime: any;
  // sendDate: any
}

class appTypeId {
  id: number;
  code?: string;
  name: string;
}