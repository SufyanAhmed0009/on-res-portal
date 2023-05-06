import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UpdateStatusRequest, UpdateStatusResponse } from 'src/app/core/models/restaurant-menu';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { RestaurantMenuService } from 'src/app/core/services/restaurant-menu.service';
import { ServiceRestaurant } from 'src/app/core/services/restaurant.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
export interface UpdateRestaurantStatusRequest {
  restId: number;
  statusId: number;
}
@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.css']
})
export class UpdateStatusComponent implements OnInit {
  loading: boolean;
  submitting: boolean;
  restId: number;
  currentStatus: number;
  randomStatus: boolean;
  isEnabled: boolean;
  title: string= "-";
  statusRequest: UpdateRestaurantStatusRequest;

  constructor(
    private restaurantService: ServiceRestaurant,
    private dialogRef: MatDialogRef<UpdateStatusComponent>,
    private authService: ServiceAuth,
    private snackBarService: ServiceSnackbar
    
  ) { }

  ngOnInit(): void {
    this.restId = this.authService.getRestaurantId();
    this.getRestaurantStatus();
   
  }
  
  getRestaurantStatus() {
    this.restaurantService.getRestaurantStatus(this.restId).subscribe(
      (statusId: number) => {
        console.log(statusId);
        this.currentStatus = statusId;
        if(this.currentStatus==3){
      
          this.isEnabled=true;
          this.title="Enabled"
         
        }
        else if(this.currentStatus==2){
          this.isEnabled=false;
          this.title="Offline"
          
        }
        else{
          this.isEnabled=false;
          this.title="-"
          
        }
      }
    );
  
    
  
  }

  updateRestaurantStatus(newValue: boolean){
    console.log(newValue);
    if(newValue){
      this.currentStatus= 3;
      let req : UpdateRestaurantStatusRequest={
        statusId: this.currentStatus,
        restId: this.restId
      }
      this.restaurantService.updateRestaurantStatus(req).subscribe(
        (response) => {
          console.log(response.status);
          this.isEnabled=true;
          this.title="Enabled"
          this.snackBarService.showSuccessMessage("Status Updated Successfully!");
        },
        (error) => {
          this.snackBarService.showErrorMessage("Status Update Failed!");
        }
      );

    
    
  }
  else{
    this.currentStatus= 2;
    let req : UpdateRestaurantStatusRequest={
      statusId: this.currentStatus,
      restId: this.restId
    }
    this.restaurantService.updateRestaurantStatus(req).subscribe(
      (response) => {
        console.log(response.status);
        this.isEnabled=false;
        this.title="Offline"
        this.snackBarService.showSuccessMessage("Status Updated Successfully!");
      },
      (error) => {
        this.snackBarService.showErrorMessage("Status Update Failed!");
      }
    );
  }
  
}
  onClose() {
    this.dialogRef.close();
  }
}
