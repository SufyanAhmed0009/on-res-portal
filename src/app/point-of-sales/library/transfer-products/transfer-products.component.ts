import { Component, OnInit } from '@angular/core';
import { MenuCategory, RespMenuList, FilterItem, MenuResponse, UpdateStatusRequest } from 'src/app/core/models/restaurant-menu';
import { RestaurantMenuService } from 'src/app/core/services/restaurant-menu.service';
import { Restaurant, DtLanguage } from 'src/app/core/models/language'
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { interval, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MenuDetailsComponent } from '../menu-details/menu-details.component';
import { Direction } from '@angular/cdk/bidi';
import { CategoryActionsComponent } from '../modals/category-actions/category-actions.component';

@Component({
  selector: 'app-transfer-products',
  templateUrl: './transfer-products.component.html',
  styleUrls: ['./transfer-products.component.css']
})
export class TransferProductsComponent implements OnInit {

  menu: MenuCategory[] = [];
  restaurantCategories: RespMenuList[] = [];
  menuResponse: MenuResponse[];
  error: string;
  menuCategory: MenuCategory;

  categoryId: any;

  categories = [
    "categoryId",
    "categoryTitle",
    "edit",
  ]

  /*  SEARCH */
  searchCategory: any;

  /*  RESTAURANT DETAILS */
  restaurantDetails: Restaurant;
  restId: number;

  /* LANGUAGE DETAILS */
  languageDetails: DtLanguage;
  langId: number;

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
    private authService: ServiceAuth,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.restId = this.authService.getRestaurantId();
    this.langId = this.languageService.getCurrentLanguage().id;

    this.getRestaurantMenu();

    this.lastFetchedCount = 0;
    this.autoFetch = interval(10000).subscribe(
      () => {
        this.lastFetchedCount += 10;
        if (this.lastFetchedCount >= 60 && !this.loading) {
          this.getRestaurantMenu();
        }
      }
    );

    this.restaurantMenuService.dateUpdated.subscribe(
      () => {
        this.getRestaurantMenu();
      }
    );

    this.authService.restaurantChanged.subscribe(
      (restaurant: Restaurant) => {
        this.restId = this.authService.getRestaurantId();
        this.getRestaurantMenu();
      }
    )

    this.restaurantMenuService.dataUpdated.subscribe(
      () => {
        this.getRestaurantMenu();
      }
    );
  }

  getRestaurantMenu() {
    this.loading = true;
    this.restaurantMenuService.getRestaurantMenu(this.restId).subscribe(
      (response: MenuCategory[]) => {
        this.menu = response;
        this.loading = false;
        this.lastFetched = new Date();
        this.lastFetchedCount = 0;
      }
    );
  }

  onSelectCategory(menuList: MenuResponse) {
    debugger
    console.log("menuList")
    console.log(menuList)
    console.log(menuList.menuItems)
    this.matDialog.open(MenuDetailsComponent, {
      width: '900px',
      data: { menuDetails: menuList.menuItems },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    })
  }

  onSearch(keyword: string) {
    this.searchCategory = this.menu.filter((category) => {
      return category.categoryTitle.toLowerCase().includes(keyword.toLowerCase())
    })
  }

  onCancelSearch() {
    this.searchCategory = null
    this.getRestaurantMenu();
  }

  onRefresh() {
    this.searchCategory = null;
    this.getRestaurantMenu();
  }

  onStatusChanged() {
    if (this.selectedStatus == 0) {
      this.currentStatus = null;
      this.getRestaurantMenu();
    } else {
      this.currentStatus = this.selectedStatus;
      this.getRestaurantMenu();
    }
  }

  onEdit(categoryMenu: MenuResponse){
    this.matDialog.open(CategoryActionsComponent, {
      width: '900px',
      data: { categoryId: categoryMenu.categoryId, restaurantId: this.restId },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    })
  }
}
