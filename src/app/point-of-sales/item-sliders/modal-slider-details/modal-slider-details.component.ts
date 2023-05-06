import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemSilderResponse } from 'src/app/core/models/item-sliders';
import { ServiceItemSliders } from 'src/app/core/services/item-sliders.service';

@Component({
  selector: 'modal-slider-details',
  templateUrl: './modal-slider-details.component.html',
  styleUrls: ['./modal-slider-details.component.css']
})
export class ModalSliderDetailsComponent implements OnInit {

  columnsList = [
    "id",
    "title",
    "details"
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { slider: ItemSilderResponse },
    private dialogRef: MatDialogRef<ModalSliderDetailsComponent>,
  ) { }

  ngOnInit(): void {


  }

  onClose() {
    this.dialogRef.close();
  }
}
