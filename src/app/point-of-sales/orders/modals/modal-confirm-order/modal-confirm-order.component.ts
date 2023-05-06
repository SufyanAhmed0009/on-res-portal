import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelOrderConfirmRequest, RespOrderDetails } from 'src/app/core/models/orders';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceOrders } from 'src/app/core/services/orders.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-modal-confirm-order',
  templateUrl: './modal-confirm-order.component.html',
  styleUrls: ['./modal-confirm-order.component.css']
})
export class ModalConfirmOrderComponent implements OnInit {

  deliveryDate: Date;
  deliveryTime: string;
  processing: boolean;
  changeStatus: boolean;
  confirmedTime: number;
  branchId: number;
  customerOrderId: number;
  respOrderInfo: RespOrderDetails;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { id: number, riderId: number, expected: Date },
    private datePipe: DatePipe,
    private ordersService: ServiceOrders,
    private snackBarService: ServiceSnackbar,
    private dialogRef: MatDialogRef<ModalConfirmOrderComponent>,
    private authService: ServiceAuth,
  ) { }

  ngOnInit(): void {
    this.branchId = this.authService.getBranchId();
    // this.restaurantId = this.authService.getRestaurantId();
    this.changeStatus = true;
    this.deliveryDate = this.data.expected;
    this.deliveryTime = this.datePipe.transform(this.data.expected, 'HH:mm');
    this.customerOrderId = this.data.id

    this.ordersService.getOrderDetails(this.customerOrderId, this.branchId).subscribe(
      (response: RespOrderDetails) => {
        this.confirmedTime = this.data.expected.getTime() + response.margin;
      }
    )

  }

  onConfirm() {

    let datePart: string = this.datePipe.transform(this.deliveryDate, "y-MM-dd");
    let confirmDate = new Date(Date.parse(datePart + 'T' + this.deliveryTime));
    let confirmDateString = this.datePipe.transform(confirmDate, "yyyy-MM-dd HH:mm:ss", '+0000');

    let request: ModelOrderConfirmRequest = {
      orderInfo: {
        id: this.data.id,
      },
      languageInfo: {
        code: "LANG0001"
      },
      riderId: this.data.riderId,
      expectedDeliveryDate: confirmDateString,
      changeStatus: this.changeStatus,
    }

    this.processing = true;
    this.ordersService.confirmOrder(request).subscribe(
      (response) => {
        console.log("response")
        console.log(response)
        this.snackBarService.showSuccessMessage("Successfully Updated Status");
        this.ordersService.ordersUpdated.emit();
        this.dialogRef.close(true);
      },
      (error) => {
        console.log("error")
        console.log(error)
        this.processing = false;
        this.snackBarService.showErrorMessage("Error updating status");

      }
    );

  }

  onClose() {
    this.dialogRef.close();
  }

}

