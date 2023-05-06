import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceRestaurant } from 'src/app/core/services/restaurant.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { UpdateStatusComponent } from '../update-status/update-status.component';
export class TimeOptions {
  time: any;
  id: number;
  selected: boolean;
  selectable?: boolean;
 

  
}
export interface PauseRestaurantRequest {
  restId: number;
  statusId: number;
  pauseDuration: string;
}

@Component({
  selector: 'app-pause-restaurant',
  templateUrl: './pause-restaurant.component.html',
  styleUrls: ['./pause-restaurant.component.css']
})
export class PauseRestaurantComponent implements OnInit {

  displayedColumns: string[] = ["radioValue", 'timeSlot'];
  dataSource:  MatTableDataSource<TimeOptions> 
  ELEMENT_DATA: TimeOptions[];
  selectedTime;
  startDate = new Date();
  count =0;
  selection: SelectionModel<TimeOptions> = new SelectionModel<TimeOptions>(false, []);
  isSubmitting: boolean= false;
  selectedRow: TimeOptions;
  restId: number;

  constructor(
    private restaurantService: ServiceRestaurant,
    private dialogRef: MatDialogRef<UpdateStatusComponent>,
    private authService: ServiceAuth,
    private snackBarService: ServiceSnackbar
  ) { 
  }

  ngOnInit(): void {
   
    //let newDate = new Date();
    this.ELEMENT_DATA=[]
    this.restId = this.authService.getRestaurantId();
  //  console.log(this.roundTimeTo30Interval(newDate).toString());
    this.dataSource =new MatTableDataSource();
    this.addIntervalsToDataSource();
    
    // this.ELEMENT_DATA = [
    //   { id:1,name: 'Update Restaurant Status (ENABLE/OFFLINE)'},
    //   {id:2, name: 'Pause Restaurant'},
    // ];
    

  }
  onClose() {
    this.dialogRef.close();
    
  }
  radioSelected() {
    console.log(this.selectedTime);
  }

  roundTimeTo30Interval(date: Date, fDt: Date): any{
    let minutes : number;
    if(date.getMinutes()< 30){
      minutes= 30-date.getMinutes();

    }
    else{
      minutes= 60-date.getMinutes();
    }
     date.setMinutes(date.getMinutes() + minutes);
     
     let dateTime= formatDate(date,'yyyy-MM-dd HH:mm:ss','en-US');
     fDt=date;
     let tempClass = new TimeOptions();
     tempClass.time=dateTime;
     tempClass.id=this.count;
     tempClass.selected= false;
     this.ELEMENT_DATA.push(tempClass);
     console.log(this.ELEMENT_DATA)
     ;
     this.count++;
    
    return fDt
  }

  addIntervalsToDataSource(){

    const arrayTemp : TimeOptions[]= [];
    this.ELEMENT_DATA=[];
    let newDate : Date;
  
    for (let i = 0; i < 4; i++) {
    
      let formattedDate  ;
      if(i==0){
      newDate = this.roundTimeTo30Interval(this.startDate, formattedDate);}
      else{
        newDate = this.roundTimeTo30Interval(newDate, formattedDate);
      }
      this.startDate=newDate;
      
     let val=i;

    }
    
    
    this.dataSource.data=this.ELEMENT_DATA;
    this.dataSource.data.forEach((row, i) => row.selectable = true);
  }

  selectRow($event: any, row:TimeOptions){
    console.log("clicked", $event);
    $event.preventDefault();
        if (row.selectable && !row.selected) {
            this.dataSource.data.forEach((row) => row.selected = false);
            
            row.selected = true;
            this.selection.select(row);
            this.selectedRow=row;
            console.log(this.selectedRow)
            
            }
        }
  

  onSubmit(){
    if(!this.isSubmitting){
    if(this.selectedRow!=null || this.selectedRow!=undefined)
    {
      this.isSubmitting=true;
    let req: PauseRestaurantRequest={
          restId : this.restId,
          statusId: 34,
          pauseDuration: this.selectedRow.time
    }
    this.restaurantService.PauseRestaurant(req).subscribe(
      (response) => {
        console.log(response.status);
        this.isSubmitting=true;
        this.snackBarService.showSuccessMessage("Paused Restaurant Successfully!");
        this.isSubmitting=false;
      },
      
      (error) => {
        this.snackBarService.showErrorMessage("Paused Restaurant Failed!");
        this.isSubmitting=false;
      });
  }
    else{ this.snackBarService.showErrorMessage("Select an interval");
  }}
  else{
     this.snackBarService.showSuccessMessage("Loading..");
  }
  
}
}

