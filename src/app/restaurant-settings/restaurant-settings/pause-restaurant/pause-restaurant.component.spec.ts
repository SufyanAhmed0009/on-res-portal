import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PauseRestaurantComponent } from './pause-restaurant.component';

describe('PauseRestaurantComponent', () => {
  let component: PauseRestaurantComponent;
  let fixture: ComponentFixture<PauseRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PauseRestaurantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PauseRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
