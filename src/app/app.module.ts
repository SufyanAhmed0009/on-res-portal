import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './authentication/login/login.component';
import { PointOfSalesModule } from './point-of-sales/pos.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AuthBoxComponent } from './authentication/auth-box/auth-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
// import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { RestaurantSettingsComponent } from './restaurant-settings/restaurant-settings/restaurant-settings.component';
import { UpdateStatusComponent } from './restaurant-settings/restaurant-settings/update-status/update-status.component';
import { PauseRestaurantComponent } from './restaurant-settings/restaurant-settings/pause-restaurant/pause-restaurant.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthBoxComponent,
    RestaurantSettingsComponent,
    UpdateStatusComponent,
    PauseRestaurantComponent
  ],
  imports: [
    MatRadioModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PointOfSalesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule
    // NgxImageZoomModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, 
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
