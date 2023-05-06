import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddMenuCategory, MenuCategoryDetails, MenuDay } from 'src/app/core/models/category';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { RestaurantMenuService } from 'src/app/core/services/restaurant-menu.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-category-actions',
  templateUrl: './category-actions.component.html',
  styleUrls: ['./category-actions.component.css']
})
export class CategoryActionsComponent implements OnInit {

  langId: number;
  restId: number;
  isSubmitting: boolean;

  currentCategory: MenuCategoryDetails;
  timeRanges: MenuDay[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { categoryId: number, restaurantId: number },
    private dialogRef: MatDialogRef<CategoryActionsComponent>,
    private datePipe: DatePipe,
    private restaurantMenuService: RestaurantMenuService,
    private languageService: ServiceLanguage,
    private authService: ServiceAuth,
    private snackBarService: ServiceSnackbar,
  ) { }

  ngOnInit(): void {
    this.langId = this.languageService.getCurrentLanguage().id;
    this.restId = this.authService.getRestaurantId();

    this.getCategoryDetails()
  }

  onClose() {
    this.dialogRef.close();
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

  getCategoryDetails() {
    if (this.data.categoryId != null) {
      this.restaurantMenuService.getMenuCategoryDetails(this.data.categoryId, this.langId).subscribe(
        (response: MenuCategoryDetails) => {
          this.currentCategory = response;
          this.timeRanges = this.currentCategory.menuDayList;
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
    else {
      this.onAddTime();
    }
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
      status: {
        id: 3
      }
    });
  }

  removeTime(index: number) {
    this.timeRanges.splice(index, 1);
  }

  onSubmit() {
    
  }

  onCancel() {
    this.dialogRef.close();
  }
}
