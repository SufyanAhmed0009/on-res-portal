import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalAddSlider } from 'src/app/core/models/item-sliders';
import { ModelStatus } from 'src/app/core/models/restaurant-menu';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceItemSliders } from 'src/app/core/services/item-sliders.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ServiceStatus } from 'src/app/core/services/status.service';

@Component({
  selector: 'modal-add-item-slider',
  templateUrl: './modal-add-item-slider.component.html',
  styleUrls: ['./modal-add-item-slider.component.css']
})
export class ModalAddItemSliderComponent implements OnInit {

  
  detailsForm: FormGroup;
  isLoading: boolean;
  statusList: ModelStatus[];


  /* FORM SUBMISSION */
  isSubmitting: boolean;

  currentSlider: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { slider: any },
    private dialogRef: MatDialogRef<ModalAddItemSliderComponent>,
    private itemSliderService: ServiceItemSliders,
    private statusService: ServiceStatus,
    private languageService: ServiceLanguage,
    private snackBarService: ServiceSnackbar,
    private authService: ServiceAuth,
  ) { }

  ngOnInit(): void {
    console.log("this.data")
    console.log(this.data)
    this.statusList = this.statusService.getEnableDisabledStatuses();

    this.detailsForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      code: new FormControl(null, Validators.required),
      sortOrder: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
    });

    this.setPreFillData();
  }

  setPreFillData() {
    if (this.data != null) {
      this.currentSlider = this.data.slider;
      //SETTING DETAILS FORM.
      this.detailsForm.controls.title.setValue(this.currentSlider.title);
      this.detailsForm.controls.code.setValue(this.currentSlider.code);
      this.detailsForm.controls.sortOrder.setValue(this.currentSlider.sortOrder);
      this.detailsForm.controls.status.setValue(this.currentSlider.status.id);
    }
  }

  onSubmit() {
    let request: ModalAddSlider = {
      title: this.detailsForm.controls.title.value,
      code: this.detailsForm.controls.code.value,
      sortOrder: this.detailsForm.controls.sortOrder.value,
      statusId: this.detailsForm.controls.status.value,
      restId: this.authService.getRestaurantId()
    }

    this.isSubmitting = true;
    if (this.currentSlider == null) {
    
      console.log("request")
      console.log(request)
      console.log(JSON.stringify(request))
      this.itemSliderService.onAddUpdateSlider(request).subscribe(
        (response) => {
          this.snackBarService.showSuccessMessage("Slider Added Successfully!");
          this.itemSliderService.dataUpdated.emit();
          this.dialogRef.close(true);
        },
        (error) => {
            this.snackBarService.showErrorMessage("Error Adding Slider! Try again.");
            this.isSubmitting = false;
          
        }
      );
    } else {

      // UPDATE 
      request.id = this.currentSlider.id;
      console.log("request")
      console.log(request)
      console.log(JSON.stringify(request))
      this.itemSliderService.onAddUpdateSlider(request).subscribe(
        (response) => {
          this.snackBarService.showSuccessMessage("Slider Updated Successfully!");
          this.itemSliderService.dataUpdated.emit();
        
          this.dialogRef.close();
        },
        (error) => {
            this.snackBarService.showErrorMessage("Error Updating Slider! Try again.");
            this.isSubmitting = false;
          
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

}


