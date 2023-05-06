import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitter } from 'events';
import { RespOrder } from 'src/app/core/models/orders';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { Direction } from '@angular/cdk/bidi';
import { UpdateStatusComponent } from './update-status/update-status.component';
import { PauseRestaurantComponent } from './pause-restaurant/pause-restaurant.component';
export interface Options {
  name: string;
  id: number;
  
}

const ELEMENT_DATA: Options[] = [
  { id:1,name: 'Update Restaurant Status (ENABLE/OFFLINE)'},
  {id:2, name: 'Pause Restaurant'}
 
];
@Component({
  selector: 'app-restaurant-settings',
  templateUrl: './restaurant-settings.component.html',
  styleUrls: ['./restaurant-settings.component.css']
})
export class RestaurantSettingsComponent implements OnInit {

  displayedColumns: string[] = ["id", 'options'];
  dataSource = ELEMENT_DATA;
  
  constructor(
    
   
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
  ) { }


  onSelected(row: Options){
    if(row.id==1){
    this.matDialog.open(
      UpdateStatusComponent, {
      width: '900px',  
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });}
   else if(row.id==2){
      this.matDialog.open(
        PauseRestaurantComponent, {
        width: '900px',  
        direction: <Direction>this.languageService.getCurrentLanguage().dir,
        autoFocus: false,
        maxHeight: '90vh'
      });}
  }

  ngOnInit(): void {
  }

}
