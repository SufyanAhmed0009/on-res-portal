import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { tap } from 'rxjs/operators';
import { DtSelectItem } from 'src/app/core/models/select';
import { ServiceSelectors } from 'src/app/core/services/selectors.service';

@Component({
  selector: 'users-selector',
  templateUrl: './users-selector.component.html',
  styleUrls: ['./users-selector.component.css']
})
export class UsersSelectorComponent implements OnInit {

  users: DtSelectItem[];
  inputControl: FormControl;
 
  @Input('franchise') franchise: number;
  @Input('value') value: string;
  @Output('selected') selected = new EventEmitter<DtSelectItem>();
  @Output('cleared') cleared = new EventEmitter<void>();

  constructor(private selectorsService: ServiceSelectors) { }

  ngOnInit(): void {

    this.inputControl = new FormControl(this.value);
    this.inputControl.valueChanges.subscribe(
      (value: string) => {
        if (value.length >= 3){
          this.updateList(value);
        }
      }
    );
    this.users = [];

  }

  updateList(keyword: string){
    let franchiseId = this.franchise ? this.franchise : 0;
    this.selectorsService.selectAppUsersTwo(keyword, franchiseId).pipe(
      tap((response: DtSelectItem[]) => {
        this.users = response.map(
          (item) => {
            item.value = item.title;
            // item.value = item.title + ' ' + item.details;
            return item; 
          }
        );
      })
    ).subscribe();
  }

  optionSelected(event: MatAutocompleteSelectedEvent){
    let value = event.option.value;
    let user = this.users.find((item) => item.value == value);
    this.selected.emit(user);
  }

  clearSelection(){
    this.inputControl.setValue('');
    this.cleared.emit();
  }

}
