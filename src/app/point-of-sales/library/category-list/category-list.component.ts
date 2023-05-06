import { Direction } from '@angular/cdk/bidi';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CategoryDetails, MenuCategoryDetails, MenuCategoryList, MenuCategoryRequest, MenuCategoryResponse } from 'src/app/core/models/category';
import { Restaurant } from 'src/app/core/models/language';
import { DtPageInfo } from 'src/app/core/models/page';
import { FilterItem, MenuCategory, MenuResponse, RestaurantMenuCategoryRequest } from 'src/app/core/models/restaurant-menu';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { RestaurantMenuService } from 'src/app/core/services/restaurant-menu.service';
import { CategoryActionsComponent } from '../modals/category-actions/category-actions.component';
import { MenuDetailsComponent } from '../menu-details/menu-details.component';
import { ServiceImageModal } from 'src/app/core/services/image-modal.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  /* CATEGORY LIST */
  categories = [
    "categoryId",
    "categoryTitle",
    "image",
    "categoryStatus",
    "edit",
  ]

  /* CATEGORY */
  categoryId: number;
  currentCategory: MenuCategoryList[];
  menu: MenuCategory[];
  categoryDetails: CategoryDetails[];
  category = [];
  menuResponse: MenuResponse;

  /* RESTAURANT */
  restId: number;

  /* LANGUAGE */
  langId: number;
  langName: string;

  /* PAGE */
  currentPage: DtPageInfo;
  count: number;

  /* LOADER */
  lastFetched: Date;
  lastFetchedCount: number;
  autoFetch: Subscription;
  loading: boolean;

  /* STATUS */
  selectedStatus = 3;
  currentStatus: number;
  statusToggleList: FilterItem[] = [
    { title: 'All Items', value: 0 },
    { title: 'Enabled Only', value: 3 },
    { title: 'Disabled Only', value: 4 },
  ]

  constructor(
    private restaurantMenuService: RestaurantMenuService,
    private languageService: ServiceLanguage,
    private matDialog: MatDialog,
    private authService: ServiceAuth,
    private imageModelService: ServiceImageModal,
  ) { }

  ngOnInit(): void {
    this.langId = this.languageService.getCurrentLanguage().id;
    this.langName = this.languageService.getCurrentLanguage().name;
    this.restId = this.authService.getRestaurantId();

    this.initPage();
    this.getMenuCategoryList();

    this.restaurantMenuService.dateUpdated.subscribe(
      () => {
        this.getMenuCategoryList();
      }
    );

    this.authService.restaurantChanged.subscribe(
      (restaurant: Restaurant) => {
        this.restId = this.authService.getRestaurantId();
        this.getMenuCategoryList();
      }
    );

    this.restaurantMenuService.dataUpdated.subscribe(
      () => {
        this.getMenuCategoryList();
      }
    );
  }

  initPage() {
    this.currentPage = {
      size: 10,
      page: 0,
      id: null,
      statusId: null,
      start: "",
      end: "",
      userId: null,
      hqId: null,
      restId: this.restId,
      catId: this.categoryId,
    }
  }

  getMenuCategoryList() {
    this.loading = true;
    let request: RestaurantMenuCategoryRequest = {
      pageSize: 10,
      pageStart: this.currentPage.pageStart,
      title: this.currentPage.title,
      restaurant: {
        id: this.restId,
      },
      language: {
        id: this.langId,
        name: this.langName
      }
    }
    this.restaurantMenuService.getMenuCategoryList(request).subscribe(
      (response: MenuCategoryRequest) => {
        this.currentCategory = response.menuCategorylist;
        this.count = response.count;
        this.loading = false;
        this.lastFetched = new Date();
        this.lastFetchedCount = 0;
      }
    );
  }

  onEdit(categoryMenu: MenuCategoryDetails) {
    this.matDialog.open(CategoryActionsComponent, {
      width: '900px',
      data: { categoryId: categoryMenu.id, restaurantId: this.restId },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    })
  }

  onSearch(keyword: string) {
    this.currentPage.title = keyword;
    this.currentPage.page = 0;
    this.getMenuCategoryList();
  }

  onCancelSearch() {
    this.currentPage.title = '';
    this.currentPage.page = 0;
    this.getMenuCategoryList();
  }

  onRefresh() {
    this.getMenuCategoryList();
  }

  onPageChanged(event: PageEvent) {
    this.currentPage.page = event.pageIndex;
    this.currentPage.size = event.pageSize;
    this.getMenuCategoryList();
  }

  onStatusChanged() {
    if (this.selectedStatus == 0) {
      this.currentStatus = null;
      this.getMenuCategoryList();
    } else {
      this.currentStatus = this.selectedStatus;
      this.getMenuCategoryList();
    }
  }

  onSelect(menuList: MenuResponse) {
    debugger
    console.log("menuList")
    console.log(menuList)
    console.log("menuList.menuItems")
    console.log(menuList.menuItems)
    
    console.log("Menu Response")
    console.log(this.menuResponse)
    this.matDialog.open(MenuDetailsComponent, {
      width: "900px",
      data: { menuDetails: menuList.menuItems },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    }
    )
  }

  onOpenImage(imageUrl: string) {
    this.imageModelService.openImageModal(imageUrl);
  }

  // onCategorySelected(category: DtSelectItem) {
  //   this.currentPage.catId = category.id;
  //   this.getMenuCategoryList();
  // }

  // onCategoryCleared() {
  //   if (this.currentPage.catId !== null) {
  //     this.currentPage.catId == null;
  //     this.getMenuCategoryList();
  //   }
  // }
}
