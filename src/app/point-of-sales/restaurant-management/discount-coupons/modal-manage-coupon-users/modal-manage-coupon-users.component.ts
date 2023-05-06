import { Direction } from '@angular/cdk/bidi';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { ModalDiscUserListRequest, ModalDiscUserSheetUpload, ModelDiscountCouponResponse, ModelDiscountCouponsPage, ModelDiscountCouponUserListResponse, ModelDiscountCouponUserResponse } from 'src/app/core/models/discount-coupon';
import { ModelMembershipInfo } from 'src/app/core/models/user-app';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ModalConfirmDialogComponent } from 'src/app/shared/components/modal-confirm-dialog/modal-confirm-dialog.component';
import { ModalUserSheetUploadComponent } from '../../notifications/modal-user-sheet-upload/modal-user-sheet-upload.component';
import { ModalAddUserByPhoneComponent } from '../modal-add-user-by-phone/modal-add-user-by-phone.component';
import { ModalAssignMembershipCouponComponent } from '../modal-assign-membership-coupon/modal-assign-membership-coupon.component';
import { ModalCouponUserSheetUploadComponent } from '../modal-coupon-user-sheet-upload/modal-coupon-user-sheet-upload.component';

@Component({
  selector: 'app-modal-manage-coupon-users',
  templateUrl: './modal-manage-coupon-users.component.html',
  styleUrls: ['./modal-manage-coupon-users.component.css']
})
export class ModalManageCouponUsersComponent implements OnInit {

   /* LIST OF USERS */
   usersList: ModelDiscountCouponUserResponse[];

   /* FOR SEARCHING */
   searchForm: FormGroup;
 
   /* FOR MAT-TABLE */
   columnsList = [
     'select',
     'name',
     'number',
     'maxAmount',
     'amountUsed',
     'usageNumber',
     'totalUsage',
     'startingDate',
     'expiryDate',
     'unlimited',
     'action'
   ]
 
   /* PHONE INPUT */
   phoneInput: number;
 
   /* PAGINATION */
   currentPage: ModelDiscountCouponsPage;
   isLoading: boolean;
   numberOfRecords: number;
   userMemberships: any;
   isSubmitted: boolean;
 
   /* RIGHTS */
   showSensitiveInfo: boolean;
 
   constructor(
     private dialogRef: MatDialogRef<ModalManageCouponUsersComponent>,
     @Inject(MAT_DIALOG_DATA) public data: { coupon: ModelDiscountCouponResponse },
     private discountCouponService: ServiceDiscountCoupon,
     private matDialog: MatDialog,
     private languageService: ServiceLanguage,
     private snackBarService: ServiceSnackbar,
     private datepipe: DatePipe,
     private authService: ServiceAuth,
   ) { }
 
   ngOnInit() {
 
    //  this.showSensitiveInfo = this.authService.getShowSensitiveInfo(); 
     this.searchForm = new FormGroup({
       'searchInput': new FormControl(null)
     });
 
 
     this.initVariables();
     this.getDiscountCouponUsersList();
   }
 
   /* INTIALIZING VARIABLES */
   initVariables() {
 
     this.currentPage = {
       page: 0,
       size: 10,
       id: "",
       title: "",
       branchId: "",
       couponId: this.data.coupon.id + ""
     }
 
   }
 
   addMembershipCoupon() {
     this.matDialog.open(ModalAssignMembershipCouponComponent, {
       width: '500px',
       maxWidth: '95vw',
       data: { coupon: this.data.coupon },
       direction: <Direction>this.languageService.getCurrentLanguage().dir,
       autoFocus: false,
       maxHeight: '90vh'
     });
   }
 
   /* GETTING LIST OF DISCOUNT COUPON USERS */
 
   getDiscountCouponUsersList() {
 
     this.isLoading = true;
     this.discountCouponService.getDiscountCouponUsersList(this.currentPage).subscribe(
       (data: ModelDiscountCouponUserListResponse) => {
         this.usersList = data.couponUserList;
         console.log("user list")
         console.log(this.usersList)
         this.usersList.map(
           (item) => {
             item.startingDate = new Date(item.startingDate)
             item.expiryDate = new Date(item.expiryDate)
           }
         )
         this.numberOfRecords = data.count;
         this.isLoading = false;
       }
     );
 
   }
 
   /* DROPDOWN OPTION SELECTION */
   onSelect(membership: ModelMembershipInfo) {
     console.log(membership)
   }
 
   /* ON REFRESH */
   onRefresh() {
     this.getDiscountCouponUsersList();
   }
 
 
   /* PAGINATION */
   onPageChanged($event: { previousPageIndex: number, pageIndex: number, pageSize: number, length: number }) {
 
     this.currentPage.page = $event.pageIndex;
     this.currentPage.size = $event.pageSize;
     this.getDiscountCouponUsersList();
 
   }
 
   /* REMOVE USER */
   onRemoveUser(user: ModelDiscountCouponUserResponse) {
 
     let confirmData: DtConfirmMessage = {
       message: "Remove this user?",
       confirm: "Go Ahead!",
       cancel: "Cancel"
     }
 
     let dialogRef = this.matDialog.open(ModalConfirmDialogComponent, {
       width: '400px',
       direction: <Direction>this.languageService.getCurrentLanguage().dir,
       data: confirmData,
       autoFocus: false
     });
 
     dialogRef.afterClosed().subscribe(
       (data) => {
         if (data == true) {
           this.isLoading = true;
           this.discountCouponService.removeUser(user.id).subscribe(
             (response) => {
               this.isLoading = false;
               this.snackBarService.showSuccessMessage("User removed successfully.");
               this.getDiscountCouponUsersList();
             },
             (error) => {
               this.isLoading = false;
               this.snackBarService.showErrorMessage("Error removing user.");
             }
           );
         }
       }
     );
 
   }
 
   /* ON ADD BY PHONE */
   onAddByPhone() {
     this.matDialog.open(ModalAddUserByPhoneComponent, {
       width: '500px',
       maxWidth: '95vw',
       data: { coupon: this.data.coupon },
       direction: <Direction>this.languageService.getCurrentLanguage().dir,
       autoFocus: false,
       maxHeight: '90vh'
     });
   }
 
   /* USERS UPLOAD BY EXCEL SHEET */
   onExcelUpload() {

     /* .CSV FILE */
     this.matDialog.open(ModalCouponUserSheetUploadComponent, {
       width: '900px',
       autoFocus: false,
       data: this.data,
       maxHeight: '90vh',
       direction: <Direction>this.languageService.getCurrentLanguage().dir
     }).afterClosed().subscribe(
       (response) => {
         if (response) {
           this.onRefresh();
         }
       }
     );
   }
 
   /* GET NUMBER OF SELECTED ITEMS */
   getNumberOfSelectedItems() {
     let num = 0;
     this.usersList.forEach(
       (item) => {
         num += item.isSelected ? 1 : 0;
       }
     );
     return num;
   }
 
 
   onUpdate() {
     console.log("update")
 
     if (this.getNumberOfSelectedItems() == 0) {
       this.snackBarService.showErrorMessage("No items selected!");
     } else {
       this.isLoading = true;
       let users: ModalDiscUserSheetUpload[];
 
       let selectedUsers: ModelDiscountCouponUserResponse[];
       selectedUsers = this.usersList.filter(
         (item) => {
           return item.isSelected;
         }
       );
 
       let request: ModalDiscUserListRequest = {
         isUpdate: 1,
         couponUserList: selectedUsers.map(
           (item) => {
             return {
               id: item.id,
               discountCoupon: {
                 id: this.data.coupon.id
               },
               userApp: {
                 id: item.userId,
               },
               unlimited: item.unlimited ? 1 : 0,
               usageNumber: item.usageNumber,
               maxAmount: item.maxAmount,
               totalUsage: item.totalUsage,
               amountUsed: item.amountUsed,
               expiryDate: this.datepipe.transform(item.expiryDate.toDateString(), 'yyyy-MM-dd'),
               startingDate: this.datepipe.transform(item.startingDate.toDateString(), 'yyyy-MM-dd')
             }
           }
         )
       }
 
       console.log("request")
       console.log(request)
 
       this.isSubmitted = true;
       this.discountCouponService.addUpdateDiscountCouponUsersInBulk(request).subscribe(
         (response) => {
           this.snackBarService.showSuccessMessage("Successfully Updated");
           this.discountCouponService.dataUpdated.emit();
           this.dialogRef.close();
         },
         (error) => {
           this.snackBarService.showErrorMessage("Error Updating! Try Again.");
           this.isSubmitted = false;
         }
       );
 
 
 
     }
   }
 
   /* FOR SEARCHING */
   onSearch() {
     this.currentPage.title = this.searchForm.controls.searchInput.value;
     this.currentPage.phone = this.searchForm.controls.searchInput.value;
     this.currentPage.page = 0;
     this.getDiscountCouponUsersList();
   }
 
   removeSearch() {
     this.currentPage.title = null;
     this.currentPage.phone = null;
     this.currentPage.page = 0;
     this.searchForm.controls.searchInput.setValue('');
     this.getDiscountCouponUsersList();
   }
 
   onClose() {
     this.dialogRef.close();
   }
 
 
 }
 