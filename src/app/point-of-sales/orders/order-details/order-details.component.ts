import { Component, OnInit, Inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { RespOrderDetails, ReqUpdateOrderStatus } from 'src/app/core/models/orders';
import { StatusConstants } from 'src/app/core/static/status-contants';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceOrders } from 'src/app/core/services/orders.service';
import { DtStatus } from 'src/app/core/models/status';
import { DatePipe } from '@angular/common';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ModalConfirmOrderComponent } from '../modals/modal-confirm-order/modal-confirm-order.component';
import { Direction } from '@angular/cdk/bidi';
import { title } from 'process';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  loading: boolean;
  submitting: boolean;
  order: RespOrderDetails;
  viewOnly: boolean;

  columnsList = [
    'id',
    'title',
    'actualPrice',
    'discount',
    'price',
    'quantity',
    'netPrice',
    'store'
  ];

  statusClass: any;
  storeId: number;
  statusList: DtStatus[];

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: DtDetailsInput,
    @Inject(MAT_DIALOG_DATA) public data: { orderDetails: DtDetailsInput },
    private ordersService: ServiceOrders,
    private authService: ServiceAuth,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private dialogRef: MatDialogRef<OrderDetailsComponent>,
    private datePipe: DatePipe,
    private snackbarService: ServiceSnackbar
  ) { }

  ngOnInit(): void {
    this.storeId = this.authService.getBranchId();
    this.statusList = StatusConstants.STATUS_LIST;
    this.viewOnly = this.authService.isSpectator();
    this.getDetails();
    this.statusClass = {
      'maroon': this.data.orderDetails.status == 'New',
      'green': this.data.orderDetails.status == 'Ready',
      'gray': this.data.orderDetails.status == 'Order Dispatched'
    }

  }

  getDetails() {
    this.loading = true;
    this.ordersService.getOrderDetails(this.data.orderDetails.id, this.data.orderDetails.branchId).pipe(
      tap((response: RespOrderDetails) => {
        console.log("order details");
        console.log(response);
        this.loading = false;
        this.order = response;
        this.order.orderItemList.forEach(function(item){
          var modifiers = [];
          item.orderItemTopping.map((element:any) => (modifiers.push({title: element.topping?.title, price: element.price})));
          item.orderItemFlavour.map((element:any) => (modifiers.push({title: element.flavour?.title, price: element.price})));
          item.orderItemSize.map((element:any) => (modifiers.push({title: element.size?.title, price: element.price})));
          item.orderItemCookType.map((element:any) => (modifiers.push({title: element.cookType?.title, price: element.price})));
          item.orderItemModifier.map((element:any) => (modifiers.push({title: element.itemModifierTitle, price: element.price})));
          item.modifier = modifiers;
        });
        console.log("order.orderItemList")
        console.log(this.order.orderItemList)
      })
    ).subscribe();
  }

  isEditable() {
    if (
      this.data.orderDetails.status == 'Delivered' ||
      this.data.orderDetails.status == 'DispatchOrder' ||
      this.data.orderDetails.status == 'Ready') {
      return false;
    } else {
      return true;
    }
  }

  disableMakeReadyButton() {
    if (this.data.orderDetails.status == 'New' ||
      this.data.orderDetails.status == 'Confirmed') {
      return false;
    }
    else {
      return true;
    }
  }

  getStatusTitle(code: string) {
    let status = this.statusList.find((item) => item.code == code);
    if (status) {
      return status.title;
    } else {
      return code;
    }

  }

  getBranchTotal() {
    let total = 0;
    if (this.order.orderItemList) {
      this.order.orderItemList.forEach((item) => {
        total += ((item.price - item.discount) * item.quantity)
      })
    }
    return total;
  }

  getTime(timestamp: number) {
    return new Date(timestamp);
  }

  getFeedbackScore(feedback: { title: string; score: number }) {
    if (feedback.title == 'Order') {
      if (this.order.orderDetails.isReviewd == true) {
        return feedback.score;
      } else {
        return ' -';
      }
    } else {
      return feedback.score;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onMakeReady() {
    let request: ReqUpdateOrderStatus = {
      languageInfo: {
        code: "LANG0001"
      },
      timeStamp: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      customerOrderId: '' + this.data.orderDetails.id,
      branchId: '' + this.authService.getBranchId()
    }
    this.submitting = true;
    this.ordersService.makeOrderReady(request).subscribe(
      (response: any) => {
        console.log(response);
        let type = response?.data?.message?.type;
        if (type == 'error') {
          this.snackbarService.showErrorMessage(response?.data?.message?.value);
          this.submitting = false;
        } else {
          this.data.orderDetails.status = 'Ready';
          this.submitting = false;
          this.ordersService.dateUpdated.emit();
        }

      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Updating!");
      }
    );
  }

  onDispatchOrder() {
    let request: ReqUpdateOrderStatus = {
      languageInfo: {
        code: "LANG0001"
      },
      timeStamp: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      customerOrderId: '' + this.data.orderDetails.id,
      branchId: '' + this.authService.getBranchId()
    }
    this.submitting = true;
    this.ordersService.dispatchOrder(request).subscribe(
      (response: any) => {
        let type = response?.data?.message?.type;
        if (type == 'error') {
          this.snackbarService.showErrorMessage(response?.data?.message?.value);
          this.submitting = false;
        } else {
          this.data.orderDetails.status = 'Order Dispatched';
          this.submitting = false;
          this.ordersService.dateUpdated.emit();
        }
      },
      (error) => {
        this.submitting = false;
        this.snackbarService.showErrorMessage("Error Updating!");
      }
    );
  }

  onConfirmOrder() {
    let dialogRef = this.matDialog.open(ModalConfirmOrderComponent, {
      width: '500px',
      data: { id: this.order.orderDetails.id, riderId: this.data.orderDetails.riderId, expected: this.data.orderDetails.timeLog.expected },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(
      (response) => {
        if (response) {
          this.data.orderDetails.status = 'Confirmed';
          this.ordersService.statusConfirmed.emit({ id: this.order.orderDetails.id });
        }
      }
    )
  }

}

class DtDetailsInput {
  id: number;
  status: string;
  riderId: string;
  branchId: number;
  membershipType: {
    id: number;
    title: string;
    code: string;
  }
  statusLog: {
    code: string;
    tsClient: number;
    tsServer: string;
    tsServerTime: number;
  }[];
  timeLog: {
    placed?: Date;
    expected?: Date;
    delivered?: Date;
  };
  appVersion: string;

  firstName: string;
  lastName: string;
  phone: string;
  orderCount: number;
  primaryhq: {
    id: number
    title: string;
  }
  installationId: string;
  email: string;
  username: string;
}