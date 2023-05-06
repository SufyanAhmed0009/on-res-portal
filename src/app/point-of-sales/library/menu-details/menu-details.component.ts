import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuCategory, MenuResponse, RespMenuList, UpdateStatusRequest, UpdateStatusResponse } from 'src/app/core/models/restaurant-menu';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceImageModal } from 'src/app/core/services/image-modal.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { RestaurantMenuService } from 'src/app/core/services/restaurant-menu.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service'
import { ModifierItemListComponent } from '../modals/modifier-item-list/modifier-item-list.component';
import { Direction } from '@angular/cdk/bidi';

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.css']
})
export class MenuDetailsComponent implements OnInit {

  menu: MenuCategory;
  restaurantMenu: RespMenuList;
  menuResponse: MenuResponse;
  statusResponse: UpdateStatusResponse;
  statusRequest: UpdateStatusRequest;

  columnsList = [
    'id',
    'title',
    'image',
    'price',
    'cost',
    'gst',
    'status',
    'isEnabled',
    'modifiers',
  ];

  storeId: number;
  viewOnly: boolean;
  restId: number;

  userType: string;
  userTypeList: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { menuDetails: MenuCategory[] },
    private restaurantMenuService: RestaurantMenuService,
    private authService: ServiceAuth,
    private dialogRef: MatDialogRef<MenuDetailsComponent>,
    private imageModelService: ServiceImageModal,
    private snackBarService: ServiceSnackbar,
    private languageService: ServiceLanguage,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log("data 11")
    console.log(this.data)
    this.data.menuDetails = this.data?.menuDetails.map(
      (data) => {
        if (data.status?.id == 3) {
          data.isEnabled = true;
        }
        else {
          data.isEnabled = false;
        }
        return data;
      }
    );
    this.restId = this.authService.getRestaurantId();
    this.storeId = this.authService.getBranchId();
    this.viewOnly = this.authService.isSpectator();

    this.userType = this.authService.getUserType();
    this.userTypeList = this.authService.getUserTypeList();
  
    this.getRestaurantMenu();
  }

  getRestaurantMenu() {
    this.restaurantMenuService.getRestaurantMenu(this.restId).subscribe(
      (item: MenuResponse) => {
        this.menuResponse = item;
      }
    )
  }

  updateRestaurantMenuStatus(statusId: number, rowId: number, newVal: boolean) {
    if (newVal) {
      statusId = 3;
    } else {
      statusId = 4;
    }

    let request: UpdateStatusRequest = {
      status: {
        id: statusId,
      },
      id: rowId,
    }

    this.restaurantMenuService.updateMenuItemStatus(request).subscribe(
      (response) => {
        this.restaurantMenuService.dataUpdated.emit();
        this.snackBarService.showSuccessMessage("Status Updated Successfully!");
      },
      (error) => {
        this.snackBarService.showErrorMessage("Status Update Failed!");
      }
    )
  }

  onSelectModifier(element: MenuCategory) {
    if (element.modifierItemList.length > 0) {
      let dialog = this.matDialog.open(ModifierItemListComponent, {
        width: '900px',
        data: {
          category: element
        },
        direction: <Direction>this.languageService.getCurrentLanguage().dir,
        autoFocus: false,
        maxHeight: '90vh'
      });
     
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onOpenImage(imageUrl: string) {
    this.imageModelService.openImageModal(imageUrl);
  }  
}
