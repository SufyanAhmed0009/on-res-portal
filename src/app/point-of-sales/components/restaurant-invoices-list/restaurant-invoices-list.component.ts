import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DtDateRange } from 'src/app/core/models/date';
import { Restaurant } from 'src/app/core/models/language';
import { RestaurantInvoicesResponse } from 'src/app/core/models/restaurant-invoices';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceRestaurantInvoices } from 'src/app/core/services/restaurant-invoices.service';

@Component({
  selector: 'app-restaurant-invoices-list',
  templateUrl: './restaurant-invoices-list.component.html',
  styleUrls: ['./restaurant-invoices-list.component.css']
})
export class RestaurantInvoicesListComponent implements OnInit {


  restaurantInvoices : RestaurantInvoicesResponse[];
    /* FOR TABLE */
    columnsList = [
      'id',
      'date',
      'download'
    ]

  /* PAGINATION */
  loading: boolean;
  count: number;

  /* SELECTED RESTAURANT */
  selectedRestaurant: Restaurant;

  constructor(
    private authService: ServiceAuth,
    private datePipe: DatePipe,
    private restaurantInvoiceService : ServiceRestaurantInvoices
  ) { }

  ngOnInit(): void {
    this.selectedRestaurant = {
      id: this.authService.getRestaurantId(),
      title: this.authService.getRestaurantName()
    }
    console.log("this.selectedRestaurant");
    console.log(this.selectedRestaurant);
    this.getRestaurantInvoicesList();

    this.authService.restaurantChanged.subscribe(
      (restaurant: Restaurant) => {
        this.selectedRestaurant = restaurant;
        this.getRestaurantInvoicesList();
      }
    );
  }


  getRestaurantInvoicesList() {
    this.loading = true;
    this.restaurantInvoiceService.getRestaurantInvoicesList(this.selectedRestaurant.id).subscribe(
      (response: RestaurantInvoicesResponse[]) => {
        console.log(response);
        this.restaurantInvoices = response;
        console.log("this.restaurantInvoices")
        console.log(this.restaurantInvoices)
        this.loading = false;
      }
    );
  }

  /* EVENT-HANDLER */
  onRefresh() {
    this.getRestaurantInvoicesList();
  }
  // onPageChanged($event: PageEvent) {
  //   //  this.page.page = $event.pageIndex;
  //   //  this.page.size = $event.pageSize;
  //   //  this.getStoreInvoicesList();
  // }

  onFilterByDate(range: DtDateRange) {
    // this.page.startDate = this.datePipe.transform(range.start, "yyyy-MM-dd 00:00:00");
    // this.page.endDate = this.datePipe.transform(range.end, "yyyy-MM-dd 00:00:00");
    // this.getStoreInvoicesList();
  }

  cancelFilterByDate() {
    // this.page.startDate = "";
    // this.page.endDate = "";
    // this.getStoreInvoicesList();
  }

  /* OTHER METHODS */
  getDate(timestamp: number) {
    let date = new Date(timestamp);
    date.setHours(date.getHours() - 5);
    return date;
  }

}
