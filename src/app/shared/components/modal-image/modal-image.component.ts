import { Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css']
})
export class ModalImageComponent implements OnInit {

  imageUrl: string;
  isImageLoading: boolean = false;
  imageLoadingFailed: boolean = false;
  rotated: number = 0;
  initialWidth: number = 0;
  initialHeight: number = 0;
  element: HTMLElement;


  @ViewChild('image') image: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ModalImageComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: { imageUrl: string },
  ) { }

  ngOnInit(): void {

    this.element = document.querySelector('#image');
    this.imageUrl = this.modalData.imageUrl;
  }

  ngAfterViewInit(){

  }

  onImageLoaded(){
    this.isImageLoading = false;
    let element: HTMLElement = this.image.nativeElement;
    this.initialHeight = element.offsetHeight;
    this.initialWidth = element.offsetWidth;
  }

  onImageFailed(){
    this.isImageLoading = false;
    this.imageLoadingFailed = true;
  }

  onDivRotateLeft(){
    this.rotated -= 90;
    this.element.style.transform = `rotate(${this.rotated}deg)`;
  }

  onDivRotateRight(){
    this.rotated += 90;
    this.element.style.transform =  `rotate(${this.rotated}deg)`;
  }

  onZoomIn(){
    let element: HTMLElement = this.image.nativeElement;
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    if(width < 800){
      width = width + 50;
      element.style.width = width + 'px';
    }
    if (height < 800) {
      height = height + 50;
      element.style.height = height + 'px';
    }
  }

  onZoomOut() {
    let element: HTMLElement = this.image.nativeElement;
    let width = element.offsetWidth;
    let height = element.offsetHeight;
    if (width > this.initialWidth) {
      width = width - 50;
      element.style.width = width + 'px';
    }
    if (height > this.initialHeight) {
      height = height - 50;
      element.style.height = height + 'px';
    }
  }
}
