import { Direction } from '@angular/cdk/bidi';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DtConfirmMessage } from 'src/app/core/models/confirm';
import { DtPageInfo } from 'src/app/core/models/page';
import { RestaurantDetails, RestaurantTiming } from 'src/app/core/models/restaurant';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceRestaurant } from 'src/app/core/services/restaurant.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ModalConfirmDialogComponent } from 'src/app/shared/components/modal-confirm-dialog/modal-confirm-dialog.component';

@Component({
  selector: 'app-restaurant-basic-info',
  templateUrl: './restaurant-basic-info.component.html',
  styleUrls: ['./restaurant-basic-info.component.css']
})
export class RestaurantBasicInfoComponent implements OnInit {

  restId: number;
  langId: number;
  isLoading: boolean;
  isSubmitting: boolean;

  currentPage: DtPageInfo = {};
  currentRestaurant: RestaurantDetails;
  timeRanges: RestaurantTiming[] = [];

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(
    private authService: ServiceAuth,
    private languageService: ServiceLanguage,
    private datePipe: DatePipe,
    private restaurantService: ServiceRestaurant,
    private snackBarService: ServiceSnackbar,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.langId = this.languageService.getCurrentLanguage().id;
    this.restId = this.authService.getRestaurantId();

    this.initVariables();
    this.getRestaurantDetails();

    this.authService.restaurantChanged.subscribe(
      (restaurant: RestaurantDetails) => {
        this.restId = this.authService.getRestaurantId();
        this.initVariables();
        this.getRestaurantDetails();
      }
    )
  }

  initVariables() {
    this.currentPage = {
      size: 10,
      page: 0,
      countryId: 1,
    }
  }

  getWorkingDaysList(onList) {
    return [
      { id: 4, title: "Monday", isOn: onList.includes(4) ? true : false },
      { id: 5, title: "Tuesday", isOn: onList.includes(5) ? true : false },
      { id: 6, title: "Wednesday", isOn: onList.includes(6) ? true : false },
      { id: 7, title: "Thursday", isOn: onList.includes(7) ? true : false },
      { id: 1, title: "Friday", isOn: onList.includes(1) ? true : false },
      { id: 2, title: "Saturday", isOn: onList.includes(2) ? true : false },
      { id: 3, title: "Sunday", isOn: onList.includes(3) ? true : false },
    ]
  }

  getRestaurantDetails() {
    this.currentPage.id = this.restId;
    this.restaurantService.getRestaurantDetails(this.currentPage).subscribe(
      (response: RestaurantDetails) => {
        this.currentRestaurant = response;
        this.timeRanges = this.currentRestaurant.restaurantTimings;
        var result = this.groupBy(this.timeRanges, function (item) {
          return [item.startTime, item.endTime];
        });
        this.timeRanges = [];
        var _this = this;
        result.map(function (timeRange) {
          var onList = timeRange.map((item) => item.day.id);
          var range = {
            startTime: timeRange[0].startTime,
            endTime: timeRange[0].endTime,
            workingDays: _this.getWorkingDaysList(onList)
          }
          _this.timeRanges.push(range);
        });
      }
    );
  }

  groupBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }

  onAddTime() {
    this.timeRanges.push({
      startTime: this.datePipe.transform(new Date, "h:mm a"),
      endTime: this.datePipe.transform(new Date, "h:mm a"),
      workingDays: this.getWorkingDaysList([]),
    });
  }

  onSubmit() {

  }

  onRemoveAddTime(index: number) {
    this.timeRanges.splice(index, 1);
  }
}
