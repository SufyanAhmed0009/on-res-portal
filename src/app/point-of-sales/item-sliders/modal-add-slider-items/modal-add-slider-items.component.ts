import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemSilderResponse } from 'src/app/core/models/item-sliders';
import { MenuItem, MenuItemList } from 'src/app/core/models/menu-item';
import { DtPageInfo } from 'src/app/core/models/page';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceItemSliders } from 'src/app/core/services/item-sliders.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceMenuItem } from 'src/app/core/services/menu-item.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-modal-add-slider-items',
  templateUrl: './modal-add-slider-items.component.html',
  styleUrls: ['./modal-add-slider-items.component.css']
})
export class ModalAddSliderItemsComponent implements OnInit {

  currentPage: DtPageInfo;
  isLoading: boolean;
  isSubmitting: boolean;
  totalNumberOfRecords: number;
  menuItemList: MenuItem[];
  selectedItemIds: number[] = [];
  searchForm: FormGroup;

  columnsList = [
    'select',
    'id',
    'title',
    'status',
    'sortOrder',
    'price',
    'gst',
    'discountPrice'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { slider: ItemSilderResponse },
    private dialogRef: MatDialogRef<ModalAddSliderItemsComponent>,
    private itemService: ServiceMenuItem,
    private authService: ServiceAuth,
    private languageService: ServiceLanguage,
    private itemSliderService: ServiceItemSliders,
    private snackBarService: ServiceSnackbar,

  ) { }

  ngOnInit(): void {

    console.log("this.data")
    console.log(this.data)

    this.searchForm = new FormGroup({
      'searchInput': new FormControl(null)
    });
    this.initVariables();
    this.getItemList();
  }

  /* INITIALIZING VARIABLES */
  initVariables() {
    this.currentPage = {
      pageSize: 100000,
      pageStart: 0,
      restaurant: { id: this.authService.getRestaurantId() },
      language: this.languageService.getCurrentLanguage()
    }

  }
  getItemList() {
    this.isLoading = true;
    this.itemService.getMenuItemList(this.currentPage).subscribe(
      (response: MenuItemList) => {
        console.log("response1")
        console.log(response)
        this.menuItemList = response.menuItemlist;
        this.menuItemList.map(
          (x) => {
            if (this.data.slider.itemList) {
              this.data.slider?.itemList.map(
                (y) => {
                  if (x.id == y.id)
                    x.isSelected = true;
                }
              )
            }
          }
        );
        console.log("this.menuItemList")
        console.log(this.menuItemList)
        this.totalNumberOfRecords = response.count;
        this.isLoading = false;

      }
    );
  }

  onSubmit() {
    this.menuItemList.map(
      (item) => {
        if (item.isSelected)
          this.selectedItemIds.push(item.id);
      }
    );


    let request: DtPageInfo = {
      sliderTypeId: this.data.slider.id,
      itemIds: this.selectedItemIds
    }

    this.isSubmitting = true;
    console.log("request")
    console.log(request)
    console.log(JSON.stringify(request))
    this.itemSliderService.onAddItemSlider(request).subscribe(
      (response) => {
        this.snackBarService.showSuccessMessage("Items Added Successfully!");
        this.itemSliderService.dataUpdated.emit();
        this.dialogRef.close(true);
      },
      (error) => {
        this.snackBarService.showErrorMessage("Error Adding Items! Try again.");
        this.isSubmitting = false;

      }
    );

  }

  onSearch() {
    this.currentPage.title = this.searchForm.controls.searchInput.value;
    this.currentPage.pageStart = 0;
    this.getItemList();
  }
  removeSearch() {
    this.currentPage.title = null;
    this.currentPage.pageStart = 0;
    this.currentPage.pageSize = 100000;
    this.searchForm.controls.searchInput.setValue('');
    this.getItemList();
  }

  onRefresh() {
    this.getItemList();
  }

}
