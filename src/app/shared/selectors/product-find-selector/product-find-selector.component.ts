import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RespStoreProduct, RespStoreProductsList } from 'src/app/core/models/products';
import { ServiceSelectors } from 'src/app/core/services/selectors.service';

@Component({
  selector: 'product-find-selector',
  templateUrl: './product-find-selector.component.html',
  styleUrls: ['./product-find-selector.component.css']
})
export class ProductFindSelectorComponent implements OnInit {

  products: RespStoreProduct[];
  inputControl: FormControl;

  @Input('storeId') storeId: number;
  @Output('selected') selected = new EventEmitter<RespStoreProduct>();

  constructor(private selectorsService: ServiceSelectors) { }

  ngOnInit(): void {
    this.inputControl = new FormControl();
    this.inputControl.valueChanges.subscribe(
      (keyword: string) => {
        this.updateList(keyword);
      }
    );
  }

  updateList(keyword: string) {
    this.selectorsService.selectProducts(
      keyword,
      this.storeId
    ).subscribe(
      (response: RespStoreProductsList) => {
        this.products = response.branchItems;
      }
    );
  }

  onProductSelected(title: string) {
    let product = this.products.find((item) => item.title == title);
    this.selected.emit(product);
    console.log(product);
    this.inputControl.setValue('');
    this.products = [];
  }

}
