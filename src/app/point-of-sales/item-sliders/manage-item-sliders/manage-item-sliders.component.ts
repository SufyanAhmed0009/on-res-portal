import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DtPage } from 'src/app/core/models/page';
import { ServiceItemSliders } from 'src/app/core/services/item-sliders.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ModalAddItemSliderComponent } from '../modal-add-item-slider/modal-add-item-slider.component';
import { Direction } from '@angular/cdk/bidi';
import { ItemSilderListResponse, ItemSilderResponse } from 'src/app/core/models/item-sliders';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ModalSliderDetailsComponent } from '../modal-slider-details/modal-slider-details.component';
import { ModalAddSliderItemsComponent } from '../modal-add-slider-items/modal-add-slider-items.component';
import { Restaurant } from 'src/app/core/models/language';

@Component({
  selector: 'manage-item-sliders',
  templateUrl: './manage-item-sliders.component.html',
  styleUrls: ['./manage-item-sliders.component.css']
})
export class ManageItemSlidersComponent implements OnInit {

  totalNumberOfRecords: number;
  currentPage: DtPage;
  isLoading: boolean = false;
  searchForm: FormGroup;
  sliderList: ItemSilderResponse[];
 

  /* SELECTED RESTAURANT */
  selectedRestaurant: Restaurant;

  columnsList = [
    'id',
    'title',
    'code',
    'sortOrder',
    'status',
    'actions'
  ];
  constructor(
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private itemSliderService: ServiceItemSliders,
    private authService: ServiceAuth,
  ) { }

  ngOnInit(): void {
    this.selectedRestaurant = {
      id: this.authService.getRestaurantId(),
      title: this.authService.getRestaurantName()
    }

    this.searchForm = new FormGroup({
      'searchInput': new FormControl(null)
    });
    this.initVariables();
    this.getList();
    this.itemSliderService.dataUpdated.subscribe(
      () => this.getList()
    );

    this.authService.restaurantChanged.subscribe(
      (restaurant: Restaurant) => {
        this.selectedRestaurant = restaurant;
        this.initVariables();
        this.getList();
      }
    );
  }

  initVariables() {
    this.currentPage = {
      page: 0,
      size: 10,
      restId: this.selectedRestaurant.id
    }
  }

  getList() {
    this.isLoading = true;
    this.itemSliderService.getSliderList(this.currentPage).subscribe(
      (response: ItemSilderListResponse) => {
        console.log("response")
        console.log(response)
        this.sliderList = response.itemSliderList;
        this.totalNumberOfRecords = response.count;
        this.isLoading = false;
      }
    );
  }

  onSearch() {
    this.currentPage.title = this.searchForm.controls.searchInput.value;
    this.currentPage.page = 0;
    this.getList();
  }
  removeSearch() {
    this.currentPage.title = null;
    this.currentPage.page = 0;
    this.currentPage.size = 10;
    this.searchForm.controls.searchInput.setValue('');
    this.getList();
  }

  onRefresh() {
    this.getList();
  }
  onPageChanged($event: { previousPageIndex: number, pageIndex: number, pageSize: number, length: number }) {

    this.currentPage.page = $event.pageIndex;
    this.currentPage.size = $event.pageSize;
    this.getList();

  }

  onAddSlider() {
    this.matDialog.open(ModalAddItemSliderComponent, {
      width: '450px',
      data: null,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  onUpdateSlider(element: ItemSilderResponse) {
    this.matDialog.open(ModalAddItemSliderComponent, {
      width: '450px',
      data: {
        slider: element
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  onSelectRow(element: ItemSilderResponse) {
    this.matDialog.open(ModalSliderDetailsComponent, {
      width: '600px',
      data: {
        slider: element
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  onAddItem(element: ItemSilderResponse) {
    this.matDialog.open(ModalAddSliderItemsComponent, {
      width: '900px',
      data: {
        slider: element
      },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }



}