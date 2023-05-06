import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PointOfSalesComponent } from './pos.component';
import { AuthGuardService } from '../core/guards/auth-guard.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ManageOrdersComponent } from './orders/manage-orders/manage-orders.component';
import { TransferProductsComponent } from './library/transfer-products/transfer-products.component';
import { CategoryListComponent } from './library/category-list/category-list.component'
import { RestaurantBasicInfoComponent } from './settings/restaurant-basic-info/restaurant-basic-info.component';
import { RestaurantSettingsComponent } from '../restaurant-settings/restaurant-settings/restaurant-settings.component';
import { RestaurantInvoicesListComponent } from './components/restaurant-invoices-list/restaurant-invoices-list.component';
import { ManageItemSlidersComponent } from './item-sliders/manage-item-sliders/manage-item-sliders.component';
import { ManageDiscountCouponsComponent } from './restaurant-management/discount-coupons/manage-discount-coupons/manage-discount-coupons.component';
import { ManageNotificationsComponent } from './restaurant-management/notifications/manage-notifications/manage-notifications.component';
import { ChatPanelComponent } from './restaurant-chat/chat-panel/chat-panel.component';
import { ManageSliderImagesComponent } from './restaurant-management/slider-images/manage-slider-images/manage-slider-images.component';

const routes: Routes = [
    {
        // path: 'pos',
        path: 'smarty',
        component: PointOfSalesComponent,
        canActivate: [AuthGuardService],
        // canActivateChild: [AuthGuardService],
        children: [
            // { path: 'invoices/pos-summary', component: SalesSummaryComponent },
            // { path: 'invoices', component: GenerateInvoiceComponent },
            // { path: 'invoices/history', component: InvoicesHistoryComponent },
            { path: 'library/manage-menu', component: TransferProductsComponent },
            { path: 'restaurant/invoices', component: RestaurantInvoicesListComponent },
            // { path: 'inventory/products', component: ManageProductsComponent },
            // { path: 'purchases/manage', component: ManagePurchasesComponent },
            // { path: 'purchases/upload-sheet', component: UploadSheetComponent },
            // { path: 'purchases/history', component: PurchasesHistoryComponent },
            { path: 'orders/manage', component: ManageOrdersComponent },
            { path: 'settings', component: RestaurantSettingsComponent },
            // { path: 'orders/sales', component: OrdersSalesComponent },
            // { path: 'finance/summary', component: SalesSummaryComponent },
            { path: 'settings/restaurant', component: RestaurantBasicInfoComponent},
            { path: 'library/manage-category', component: CategoryListComponent },
            { path: 'restaurant/item-sliders', component: ManageItemSlidersComponent },
            { path: 'restaurant/discounts', component: ManageDiscountCouponsComponent },
            { path: 'restaurant/notifications', component: ManageNotificationsComponent },
            { path: 'restaurant/chat', component: ChatPanelComponent },
            { path: 'restaurant/slider-images', component: ManageSliderImagesComponent },
            { path: '**', component: NotFoundComponent },
        ]
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PointOfSalesRoutingModule { }
