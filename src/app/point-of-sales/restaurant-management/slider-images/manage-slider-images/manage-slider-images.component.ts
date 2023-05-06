import { Direction } from '@angular/cdk/bidi';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Restaurant } from 'src/app/core/models/language';
import { DtPageInfo } from 'src/app/core/models/page';
import { SliderImageListResponse, SliderImageResponse } from 'src/app/core/models/slider-image';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceImageModal } from 'src/app/core/services/image-modal.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceSliderImage } from 'src/app/core/services/slider-image.service';
import { ModalAddSliderImagesComponent } from '../modal-add-slider-images/modal-add-slider-images.component';

@Component({
  selector: 'manage-slider-images',
  templateUrl: './manage-slider-images.component.html',
  styleUrls: ['./manage-slider-images.component.css']
})
export class ManageSliderImagesComponent implements OnInit {

  /* FOR SEARCHING */
  searchForm: FormGroup;

  /* SLIDER IMAGES */
  sliderImages: SliderImageResponse[] = [];

  selectedRestaurant: Restaurant;

  /* MAT-TABLE */
  columnsList = [
    'id',
    'fileName',
    'image',
    'sortOrder',
    'isMainPage',
    'status',
    'actions'
  ];

  /* PAGINATION */
  currentPage: DtPageInfo;
  currentStatus: number;
  totalNumberOfRecords: number;
  isLoading: boolean = false;

  /* STATUS LIST */
  statusToggleList: DtFilterItem[] = [
    { title: 'All Images', value: 0 },
    { title: 'Enabled Only', value: 3 },
    { title: 'Disabled Only', value: 4 },
  ]
  selectedStatus: number = 3;
  coupon: any;

  constructor(
    private sliderImageService: ServiceSliderImage,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private imageModelService: ServiceImageModal,
    private authService: ServiceAuth
  ) { }

  ngOnInit(): void {
    this.selectedRestaurant = {
      id: this.authService.getRestaurantId(),
      title: this.authService.getRestaurantName()
    }

    this.initVariables();
    this.getSliderImageList();

    this.searchForm = new FormGroup({
      'searchInput': new FormControl(null),
    });

    /* UPDATE DATA WHEN ADDING NEW SLIDER IMAGE */
    this.sliderImageService.dataUpdated.subscribe(
      () => {
        this.getSliderImageList();
      }
    );

    this.authService.restaurantChanged.subscribe(
      (response: Restaurant) => {
        this.selectedRestaurant = response;
        this.initVariables();
        this.selectedStatus = 3;
        this.getSliderImageList();
      }
    )
  }

  getSliderImageList() {
    console.log("this.currentPage")
    console.log(JSON.stringify(this.currentPage))
    this.isLoading = true;
    this.sliderImageService.getSliderImageList(this.currentPage).subscribe(
      (response: SliderImageListResponse) => {
        console.log("response");
        this.isLoading = false;
        this.sliderImages = response.imgList;
        this.totalNumberOfRecords = response.count;
        console.log(this.sliderImages)
      }
    )
  }

  /* SLIDER IMAGE */
  openImage(element: SliderImageResponse) {
    this.imageModelService.openImageModal(element.fileUrl);
  }

  /* INITIALIZING VARIABLES */
  initVariables() {
    this.currentPage = {
      page: 0,
      size: 10,
      restaurantId: this.selectedRestaurant.id,
      statusId: 3
    }

  }

  onAddSliderImage() {
    this.matDialog.open(ModalAddSliderImagesComponent, {
      width: '450px',
      data: { sliderImage: null },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  onUpdateSliderImage(sliderImage: SliderImageResponse) {
    this.matDialog.open(ModalAddSliderImagesComponent, {
      width: '450px',
      data: { sliderImage: sliderImage },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  /* FOR SEARCHING */
  onSearch() {
    this.currentPage.title = this.searchForm.controls.searchInput.value;
    this.currentPage.page = 0;
    this.getSliderImageList();
  }

  removeSearch() {
    this.currentPage.title = null;
    this.currentPage.size = 0;
    this.searchForm.controls.searchInput.setValue('');
    this.getSliderImageList();
  }

  onRefresh() {
    this.getSliderImageList();
  }

  /* ON PAGE CHANGE */
  onPageChanged($event: { previousPageIndex: number, pageIndex: number, pageSize: number, length: number }) {
    this.currentPage.page = $event.pageIndex;
    this.currentPage.size = $event.pageSize;
    this.getSliderImageList();

  }

  onStatusChanged() {
    if (this.selectedStatus == 0) {
      this.currentPage.statusId = null;
      this.getSliderImageList();
    } else {
      this.currentPage.statusId = this.selectedStatus;
      this.getSliderImageList();
    }
  }

}

class DtFilterItem {
  title: string;
  value: number;
}
