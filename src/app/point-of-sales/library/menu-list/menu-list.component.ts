import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MenuCategory, MenuResponse } from 'src/app/core/models/restaurant-menu';
import { MatTableFilter } from 'mat-table-filter';

@Component({
  selector: 'menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {

  @Input('menus') menus: MenuCategory[];
  @Output('selected') selected = new EventEmitter<MenuResponse>();
  searchCategory: string;
  filterEntity: MenuCategory;
  filterType: MatTableFilter;
  @Input ('dataSource') dataSource;

  categoryList = [
    'categoryId',
    'categoryTitle'
  ]
  constructor() { }

  ngOnInit(): void { 
    this.filterEntity = new MenuCategory();
    this.filterType = MatTableFilter.ANYWHERE;
    this.dataSource = new MatTableDataSource(this.menus);
  }

  onSelectCategory(menu: MenuResponse){
    this.selected.emit(menu);
  }
}
