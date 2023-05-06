import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDiscUserListRequest, ModalDiscUserSheetUpload, ModelDiscountCouponResponse } from 'src/app/core/models/discount-coupon';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-modal-coupon-user-sheet-upload',
  templateUrl: './modal-coupon-user-sheet-upload.component.html',
  styleUrls: ['./modal-coupon-user-sheet-upload.component.css']
})
export class ModalCouponUserSheetUploadComponent implements OnInit {

  isUploading: boolean = false;
  progress: number;
  
  usersList: ModalDiscUserSheetUpload[];
  isSubmitted: boolean;

  /* FOR MAT-TABLE */
  columnsList = [
    'name',
    'maxAmount',
    'amountUsed',
    'usageNumber',
    'totalUsage',
    'unlimited',
    'startingDate',
    'expiryDate'
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { coupon: ModelDiscountCouponResponse },
    private snackBarService: ServiceSnackbar,
    private dialogRef: MatDialogRef<ModalCouponUserSheetUploadComponent>,
    private discountCouponService: ServiceDiscountCoupon,
  ) { }

  ngOnInit(): void {
    this.progress = 0;
  }

 
  onSelected(event: any) {
    let files: File[] = event.srcElement.files;
    if (files.length > 0) {
      let file = files[0];
      if (this.isValidCSV(file)) {
        this.readCSV(file);
      } else {
        this.snackBarService.showErrorMessage("Not a valid csv file.");
      }
    }
  }

  isValidCSV(file: File) {
    return file.name.endsWith(".csv");
  }

  readCSV(file: File) {
    this.isUploading = true;
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      let data = reader.result;
      let lines = (<string>data).split(/\r\n|\n/);
      this.setUserList(lines);
      this.isUploading = false;
    };
    reader.onerror = () => {
      console.error('Error reading file!');
      this.isUploading = false;
    };
  }

  setUserList(lines: string[]) {
    let users: ModalDiscUserSheetUpload[] = [];
    lines = lines.slice(1);
    lines.forEach(
      (line: string) => {
        let data = line.split(',');
        if (data.length >= 3) {
          let user: ModalDiscUserSheetUpload = {
            discountCoupon: {
                            id: this.data.coupon.id,
                          },
                          userApp: {
                            id: +data[1]
                          },
                          username: data[0],
                          unlimited: +data[2],
                          usageNumber: +data[3],
                          maxAmount: +data[4],
                          totalUsage: +data[5],
                          amountUsed: +data[6],
                          expiryDate: data[7],
                          startingDate: data[8]
          }
          users.push(user);
        }
      }
    );
    this.usersList = users;
  }

  onSubmit() {
    console.log("Submit")
    console.log("this.usersList")
    console.log(this.usersList)
    let request: ModalDiscUserListRequest = {
      isUpdate: 0,
      couponUserList: this.usersList.map(
        (item) => {
              return {
                discountCoupon: {
                  id: this.data.coupon.id
                },
                userApp: {
                  id: item.userApp.id,
                },
                unlimited: item.unlimited,
                usageNumber: item.usageNumber,
                maxAmount: item.maxAmount,
                totalUsage: item.totalUsage,
                amountUsed: item.amountUsed,
                expiryDate: item.expiryDate,
                startingDate: item.startingDate
              }
            }
      )
    }
  
    this.isSubmitted = true;
    this.discountCouponService.addUpdateDiscountCouponUsersInBulk(request).subscribe(
      (response) => {
        this.snackBarService.showSuccessMessage("Successfully Added Users");
        this.discountCouponService.dataUpdated.emit();
        this.dialogRef.close(true);
      },
      (error) => {
        this.snackBarService.showErrorMessage("Error Adding Users");
        this.isSubmitted = false;
      }
    );

  }
}

