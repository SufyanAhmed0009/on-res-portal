import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PointOfSalesComponent } from './pos.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PointOfSalesRoutingModule } from './pos-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ManageOrdersComponent } from './orders/manage-orders/manage-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { ModalConfirmOrderComponent } from './orders/modals/modal-confirm-order/modal-confirm-order.component';
import { TransferProductsComponent } from './library/transfer-products/transfer-products.component';
import { MenuListComponent } from './library/menu-list/menu-list.component';
import { MenuDetailsComponent } from './library/menu-details/menu-details.component';
import { ModifierItemListComponent } from './library/modals/modifier-item-list/modifier-item-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatTableFilterModule } from 'mat-table-filter';
import { CategoryActionsComponent } from './library/modals/category-actions/category-actions.component';
import { RestaurantBasicInfoComponent } from './settings/restaurant-basic-info/restaurant-basic-info.component';
import { CategoryListComponent } from './library/category-list/category-list.component'
import { RestaurantInvoicesListComponent } from './components/restaurant-invoices-list/restaurant-invoices-list.component';
import { ManageItemSlidersComponent } from './item-sliders/manage-item-sliders/manage-item-sliders.component';
import { ModalAddItemSliderComponent } from './item-sliders/modal-add-item-slider/modal-add-item-slider.component';
import { ModalAddSliderItemsComponent } from './item-sliders/modal-add-slider-items/modal-add-slider-items.component';
import { ModalSliderDetailsComponent } from './item-sliders/modal-slider-details/modal-slider-details.component';
import { ManageDiscountCouponsComponent } from './restaurant-management/discount-coupons/manage-discount-coupons/manage-discount-coupons.component';
import { ModalAddDiscountCouponComponent } from './restaurant-management/discount-coupons/modal-add-discount-coupon/modal-add-discount-coupon.component';
import { ModalManageCouponImageComponent } from './restaurant-management/discount-coupons/modal-manage-coupon-image/modal-manage-coupon-image.component';
import { ManageNotificationsComponent } from './restaurant-management/notifications/manage-notifications/manage-notifications.component';
import { ModalNotificationUsersComponent } from './restaurant-management/notifications/modal-notification-users/modal-notification-users.component';
import { ModalEditNotificationComponent } from './restaurant-management/notifications/modal-edit-notification/modal-edit-notification.component';
import { ModalCreateNotificationComponent } from './restaurant-management/notifications/modal-create-notification/modal-create-notification.component';
import { ModalUserSheetUploadComponent } from './restaurant-management/notifications/modal-user-sheet-upload/modal-user-sheet-upload.component';
import { ModalManageCouponUsersComponent } from './restaurant-management/discount-coupons/modal-manage-coupon-users/modal-manage-coupon-users.component';
import { ModalAddUserByPhoneComponent } from './restaurant-management/discount-coupons/modal-add-user-by-phone/modal-add-user-by-phone.component';
import { ModalAssignMembershipCouponComponent } from './restaurant-management/discount-coupons/modal-assign-membership-coupon/modal-assign-membership-coupon.component';
import { ModalCouponUserSheetUploadComponent } from './restaurant-management/discount-coupons/modal-coupon-user-sheet-upload/modal-coupon-user-sheet-upload.component';
import { ChatPanelComponent } from './restaurant-chat/chat-panel/chat-panel.component';
import { ChatUserComponent } from './restaurant-chat/chat-user/chat-user.component';
import { ChatStartComponent } from './restaurant-chat/chat-start/chat-start.component';
import { ChatMessagesComponent } from './restaurant-chat/chat-messages/chat-messages.component';
import { ChatInputComponent } from './restaurant-chat/chat-input/chat-input.component';
import { ManageSliderImagesComponent } from './restaurant-management/slider-images/manage-slider-images/manage-slider-images.component';
import { ModalAddSliderImagesComponent } from './restaurant-management/slider-images/modal-add-slider-images/modal-add-slider-images.component';

@NgModule({
  declarations: [
    PointOfSalesComponent,
    NotFoundComponent,
    ManageOrdersComponent,
    OrdersListComponent,
    OrderDetailsComponent,
    ModalConfirmOrderComponent,
    TransferProductsComponent,
    MenuListComponent,
    MenuDetailsComponent,
    ModifierItemListComponent,
    CategoryActionsComponent,
    RestaurantBasicInfoComponent,
    CategoryListComponent,
    RestaurantInvoicesListComponent,
    ManageItemSlidersComponent,
    ModalAddItemSliderComponent,
    ModalAddSliderItemsComponent,
    ModalSliderDetailsComponent,
    ManageDiscountCouponsComponent,
    ModalAddDiscountCouponComponent,
    ModalManageCouponImageComponent,
    ManageNotificationsComponent,
    ModalNotificationUsersComponent,
    ModalEditNotificationComponent,
    ModalCreateNotificationComponent,
    ModalUserSheetUploadComponent,
    ModalManageCouponUsersComponent,
    ModalAddUserByPhoneComponent,
    ModalAssignMembershipCouponComponent,
    ModalCouponUserSheetUploadComponent,
    ChatPanelComponent,
    ChatUserComponent,
    ChatStartComponent,
    ChatMessagesComponent,
    ChatInputComponent,
    ManageSliderImagesComponent,
    ModalAddSliderImagesComponent,
  ],
  imports: [
    CommonModule,
    PointOfSalesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    Ng2SearchPipeModule,
    MatTableFilterModule,
  ],
  exports: [
    PointOfSalesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    DatePipe
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class PointOfSalesModule { }
