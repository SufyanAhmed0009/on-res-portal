import { Direction } from '@angular/cdk/bidi';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModelDiscountCouponListResponse, ModelDiscountCouponResponse } from 'src/app/core/models/discount-coupon';
import { DtPage } from 'src/app/core/models/page';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceDiscountCoupon } from 'src/app/core/services/discount-coupon.service';
import { ServiceImageModal } from 'src/app/core/services/image-modal.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ModalAddDiscountCouponComponent } from '../modal-add-discount-coupon/modal-add-discount-coupon.component';
import { ModalManageCouponImageComponent } from '../modal-manage-coupon-image/modal-manage-coupon-image.component';
import { ModalManageCouponUsersComponent } from '../modal-manage-coupon-users/modal-manage-coupon-users.component';

@Component({
  selector: 'app-manage-discount-coupons',
  templateUrl: './manage-discount-coupons.component.html',
  styleUrls: ['./manage-discount-coupons.component.css']
})
export class ManageDiscountCouponsComponent implements OnInit {

  couponsList: ModelDiscountCouponResponse[];
  searchForm: FormGroup;
  userRestaurants: number[];


  /* FOR TABLE */
  columnsList = [
    'id',
    'name',
    'image',
    'percentage',
    'expiry',
    'validity',
    'maxUsage',
    'edit'
  ]

  /* PAGINATION */
  currentPage: DtPage;
  totalNumberOfRecords: number;
  isLoading: boolean = false;

  constructor(
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private discountCouponService: ServiceDiscountCoupon,
    private imageModalService: ServiceImageModal,
    private snackBarService: ServiceSnackbar,
    private authService: ServiceAuth
  ) { }

  ngOnInit() {
    this.userRestaurants = this.authService.getUserRestaurantList();
    console.log("this.userRestaurants");
    console.log(this.userRestaurants);
    this.searchForm = new FormGroup({ "searchInput": new FormControl(null) });
    this.initVariables();
    this.getDiscountCouponsList();

    this.discountCouponService.dataUpdated.subscribe(
      () => {
        this.getDiscountCouponsList();
      }
    )
  }

  /* INITIALIZING VARIABLES */

  initVariables() {

    this.currentPage = {
      size: 10,
      page: 0,
      userRestaurants: this.userRestaurants

    }

  }

  /* GET DISCOUNT COUPONS LIST */
  getDiscountCouponsList() {
    console.log("this.currentPage")
    console.log(JSON.stringify(this.currentPage))
    this.isLoading = true;
    this.discountCouponService.getDiscountCouponList(this.currentPage).subscribe(
      (data: ModelDiscountCouponListResponse) => {
        console.log("data")
        console.log(data)
        this.couponsList = data.discountCouponInfo;
        this.totalNumberOfRecords = data.count;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBarService.showErrorMessage("Error Loading Data!");
      }
    );
  }

  /* ON REFRESH PAGE */

  onRefresh() {
    this.getDiscountCouponsList();
  }

  /* ON PAGE CHANGE */
  onPageChanged($event: { previousPageIndex: number, pageIndex: number, pageSize: number, length: number }) {

    this.currentPage.page = $event.pageIndex;
    this.currentPage.size = $event.pageSize;
    this.getDiscountCouponsList();

  }

  /* ON ADD */
  onAddCoupon() {
    this.matDialog.open(ModalAddDiscountCouponComponent, {
      width: '600px',
      data: {
        pageTitle: "ADD",
        coupon: null
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  /*ON COPY */
  onCopyCoupon(coupon: ModelDiscountCouponResponse) {
    this.matDialog.open(ModalAddDiscountCouponComponent, {
      width: '600px',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        pageTitle: "COPY",
        coupon,
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir
    });
  }

  /* ON UPDATE */
  onUpdateCoupon(coupon: ModelDiscountCouponResponse) {

    this.matDialog.open(ModalAddDiscountCouponComponent, {
      width: '600px',
      autoFocus: false,
      maxHeight: '90vh',
      data: {
        pageTitle: "UPDATE",
        coupon
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir
    });

  }

  /* ON MANAGE USERS */
  onManageUsers(coupon: ModelDiscountCouponResponse) {
    this.matDialog.open(ModalManageCouponUsersComponent, {
      width: '2500px',
      maxWidth: '95vw',
      data: { coupon: coupon },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }


  /* GET DATE FROM TIMESTAMP */
  getDate(timestamp: number) {
    return new Date(timestamp);
  }

  /* OPEN IMAGE MODAL */
  openImageModal(coupon: ModelDiscountCouponResponse) {
    this.matDialog.open(ModalManageCouponImageComponent, {
      width: '500px',
      data: coupon,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }
  onUserCleared() {
    this.currentPage.id = null;
    this.currentPage.page = 0;
    this.getDiscountCouponsList();
  }
  onUserSelected(user: DtSelectItem) {

    this.currentPage.id = user.id;
    this.currentPage.page = 0;
    this.getDiscountCouponsList();

  }
  removeSearch() {
    this.currentPage.title = null;
    this.currentPage.page = 0;
    this.searchForm.controls.searchInput.setValue(null);
    this.getDiscountCouponsList();
  }
  onSearch() {
    this.currentPage.title = this.searchForm.controls.searchInput.value;
    this.currentPage.page = 0;
    console.log(this.currentPage);
    this.getDiscountCouponsList();
  }
}

