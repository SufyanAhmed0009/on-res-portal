import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuCategory, Modifier, ModifierItem, UpdateStatusRequest } from 'src/app/core/models/restaurant-menu';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { RestaurantMenuService } from 'src/app/core/services/restaurant-menu.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-modifier-item-list',
  templateUrl: './modifier-item-list.component.html',
  styleUrls: ['./modifier-item-list.component.css']
})
export class ModifierItemListComponent implements OnInit {

  isLoading: boolean;
  modifierList: Modifier[] = [];

  /* RIGHTS */
  userTypeList: number[] = [];
  isAllowed: boolean;

  columnsList = [
    'id',
    'title',
    'price',
    'status',
    'isEnabled',
    //'modifierItems',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { category: MenuCategory },
    private dialogRef: MatDialogRef<ModifierItemListComponent>,
    private authService: ServiceAuth,
    private restaurantMenuService: RestaurantMenuService,
    private snackBarService: ServiceSnackbar,
  ) { }

  ngOnInit(): void {
    this.userTypeList = this.authService.getUserTypeList();
    this.isAllowed = this.userTypeList.includes(25);
    console.log("this.data.category")
    console.log(this.data.category)
    this.setModifierList();
  }

  setModifierList() {
    if (this.data.category) {
      this.data.category.modifierItemList.forEach(
        (item) => {
          item.modifiersList.forEach(
            (modifier) => {
              this.modifierList.push({
                groupId: item.modifierGroupId,
                groupTitle: item.modifierGroupTitle,
                groupMinQuantity: item.minQuantity,
                groupMaxQuantity: item.maxQuantity,
                modifierId: modifier.modifierId,
                modifierTitle: modifier.modifierTitle,
                modifierPrice: modifier.modifierPrice,
                isEnabled: modifier.status?.id == 3 ? true : false
              });
            }
          );

        }
      );
    }
    console.log("this.modifierList")
    console.log(this.modifierList)

  }

  updateStatus(rowId: number, isEnabled: boolean, modifier: Modifier) {
    let statusId = 0;
    if (isEnabled) {
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

    console.log("request")
    console.log(request)
    console.log(JSON.stringify(request))
    this.isLoading = true;
    this.restaurantMenuService.updateMenuItemModifierStatus(request, modifier).subscribe(
      (response) => {
        this.restaurantMenuService.dataUpdated.emit();
        this.snackBarService.showSuccessMessage("Status Updated Successfully!");
        this.isLoading = false;
      },
      (error) => {
        this.snackBarService.showErrorMessage("Status Update Failed!");
      }
    )
  }


  onClose() {
    this.dialogRef.close();
  }
}
