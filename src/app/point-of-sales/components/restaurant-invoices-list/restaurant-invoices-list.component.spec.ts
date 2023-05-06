import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantInvoicesListComponent } from './restaurant-invoices-list.component';

describe('RestaurantInvoicesListComponent', () => {
  let component: RestaurantInvoicesListComponent;
  let fixture: ComponentFixture<RestaurantInvoicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantInvoicesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantInvoicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
