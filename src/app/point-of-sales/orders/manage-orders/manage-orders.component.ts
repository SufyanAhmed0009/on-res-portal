import { Component, OnInit, OnDestroy} from '@angular/core';
import { DtOrdersPage } from 'src/app/core/models/page';
import { DtStatus } from 'src/app/core/models/status';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceOrders } from 'src/app/core/services/orders.service';
import { RespOrdersList, RespOrder, DtOrdersStatusCount, RespOrdersStatus } from 'src/app/core/models/orders';
import { Subscription, interval } from 'rxjs';
import { DtDateRange } from 'src/app/core/models/date';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { DtSelectItem } from 'src/app/core/models/select';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '@angular/cdk/bidi';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ResponseUserDetails } from 'src/app/core/models/user-app';
import { FranchiseListResponse } from 'src/app/core/models/franchise';
import { ServiceUser } from 'src/app/core/services/user.service';
import { ServiceFranchise } from 'src/app/core/services/franchise.service';
import { Restaurant } from 'src/app/core/models/language';

@Component({
  selector: 'manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit, OnDestroy {

  orders: RespOrder[];
  loading: boolean;
  page: DtOrdersPage;
  error: string;
  count: number;
  lastFetched: Date;
  lastFetchedCount: number;
  autoFetch: Subscription;

  /* SELECTED STORE */
  selectedStore: DtSelectItem;

  /* STATUS LIST */
  statusCountList: DtOrdersStatusCount[];
  statusCountListTwo: DtOrdersStatusCount[];

  userDetailList: ResponseUserDetails[] = [];
  userIds: number[] = [];

  franchiseDetailList: FranchiseListResponse[] = [];
  hqIds: number[] = [];
  langId: number;

  constructor(
    private authService: ServiceAuth,
    private ordersService: ServiceOrders,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private languageService: ServiceLanguage,
    private userService: ServiceUser,
    private franchiseService: ServiceFranchise

  ) { }

  ngOnInit(): void {

    this.langId = this.languageService.getCurrentLanguage().id;
    this.selectedStore = {
      id: this.authService.getBranchId(),
      title: this.authService.getBranchName(),
      details: ''
    }

    this.initStatus();
    this.initPage();
    this.getOrdersList();

    // Auto - Re-fetch.
    this.lastFetchedCount = 0;
    this.autoFetch = interval(10000).subscribe(
      () => {
        this.lastFetchedCount += 10;
        if (this.lastFetchedCount >= 60 && !this.loading) {
          this.getOrdersList();
        }
      }
    );

    // DATA UPDATED
    this.ordersService.dateUpdated.subscribe(
      () => {
        this.getOrdersList();
      }
    );

    // STORE SELECTED
    this.authService.restaurantChanged.subscribe(
      (restaurant: Restaurant) => {
        this.page.restId=this.authService.getRestaurantId();
        this.getOrdersList();
      }
    )

    this.ordersService.statusConfirmed.subscribe(
      (data: { id: number }) => {
        this.updateStatus(data.id);
      }
    );

  }

  initStatus() {
    this.statusCountList = []
    this.statusCountListTwo = [];
  }

  initPage() {
    this.page = {
      size: 10,
      page: 0,
      id: null,
      statusId: null,
      start: "",
      end: "",
      userId: null,
      hqId: null,
      orderBy: "",
      // branchId: this.authService.getBranchId(),
      restId: this.authService.getRestaurantId()
    };
  }

  getOrdersList() {
    this.loading = true;
   // this.getHighlights();
   console.log("this.page")
   console.log(this.page)
    this.ordersService.getBranchOrdersList({ ...this.page }).subscribe(
      (response: RespOrdersList) => {
        console.log("response");
        console.log(response);
        this.setListOfOrders(response);
        this.loading = false;
        this.lastFetched = new Date();
        this.lastFetchedCount = 0;
      },
      (error) => {
        this.error = 'Orders Not Found!';
      }
    );
  }

  getHighlights() {
    this.ordersService.getOrdersHighlights(
      this.selectedStore.id
    ).subscribe(
      (response: RespOrdersStatus) => {
        console.log(response);
        this.statusCountList = response.statusCount;
        this.statusCountListTwo = [ 
          {
            title: 'Delivered', 
            code: '',
            count: response.deliveredOrders ? response.deliveredOrders[1] : 0,
            amount: response.deliveredWorth ?? 0
          },
          {
            title: 'Cancelled',
            code: '',
            count: response.cancelledOrders ? response.cancelledOrders[1] : 0,
            amount: response.callededWorth ?? 0
          },
        ]
      }
    )
  }

  /* SETTING ORDERS */
  setListOfOrders(response: RespOrdersList) {
    response.orderPojoList.forEach(
      (order) => {
        order.timeLog = {};
        order.timeLog.placed = new Date(order.date);
        order.orderStatusLog?.forEach(
          (log) => {
            if (log.code == "STA104") {
              order.timeLog.delivered = new Date(log.tsServerTime);
            }
          }
        );
        if (order.deliveredTime) {
         // const expected = Date.parse(order.deliveredTime);
          order.timeLog.expected = new Date(order.deliveredTime);
        }
      }
    );
 
     /* FOR USER IDS AND FRANCHISE IDS*/
     response.orderPojoList.forEach(
      (item) => {
        if (item.userId) {
          this.userIds.push(item.userId);
        }
        if (item.hqId) {
          this.hqIds.push(item.hqId);
        }
      }
    )
    this.orders = response.orderPojoList;
    this.count = response.count;

    this.fetchUsersDetails();
    this.fetchFranchises();
  }

  fetchUsersDetails() {
    /* FOR DISTINCT IDS OF USERS */
    this.userIds = this.userIds.map(item => item)
      .filter((value, index, self) => self.indexOf(value) === index)

    if (this.userIds.length > 0) {
      this.loading = true;
      this.userService.fetchUserDetails(this.userIds).subscribe(
        (response: ResponseUserDetails[]) => {
          let str = JSON.stringify(response);
          str = str.replace(/\"{/g, '{');
          str = str.replace(/\}"/g, '}');
          str = str.replace(/\\/g, '');
          let list = JSON.parse(str)
          this.userDetailList = Object.values(list)
          console.log("this.userDetailList")
          console.log(this.userDetailList)
          this.orders.forEach(
            (data) => {
              let userDetail = this.userDetailList.find((x) => x.id == data.userId);
              if (userDetail) {
                data.userName = userDetail.username,
                  data.membershipType = userDetail.memberShipTypeInfo,
                  data.firstName = userDetail.firstName,
                  data.lastName = userDetail.lastName,
                  data.installationId = userDetail.installationId,
                  data.primaryhq = userDetail.primaryhq,
                  data.orderCount = userDetail.orderCount,
                  data.phone = userDetail.phone,
                  data.email = userDetail.email
              }
              
            }
          );
          this.loading = false;
        }
      )
    }
  }
  fetchFranchises() {
    /* FOR DISTINCT IDS OF FRANCHISES */
    this.hqIds = this.hqIds.map(item => item)
      .filter((value, index, self) => self.indexOf(value) === index)

    if (this.hqIds.length > 0) {
      this.loading = true;
      this.franchiseService.fetchFranchiseDetails(this.hqIds, this.langId).subscribe(
        (response: FranchiseListResponse[]) => {
          this.franchiseDetailList = response;
          this.orders.forEach(
            (data) => {
              let franchiseDetail = this.franchiseDetailList.find((x) => x.id == data.hqId)
              if (franchiseDetail) {
                data.franchiseTitle = franchiseDetail.title;
              }
            }
          );
          this.loading = false;
        }
      );
    }
  }

  /* EVENT-HANDLERS */

  onSearch(keyword: string) {
    this.page.orderBy = keyword;
    this.page.page = 0;
    this.getOrdersList();
  }

  onCancelSearch() {
    this.page.orderBy = '';
    this.page.page = 0;
    this.getOrdersList();
  }

  onRefresh() {
    this.getOrdersList();
  }

  onStatusSelected(status: DtStatus) {
    this.page.statusId = status.id;
    this.getOrdersList();
  }

  onStoreSelected(store: DtSelectItem) {
    this.selectedStore = store;
    this.page.branchId = this.selectedStore.id;
    this.getOrdersList();
  }
  
  onStatusCleared() {
    if (this.page.statusId !== null) {
      this.page.statusId = null;
      this.getOrdersList();
    }
  }

  onFilterByDate(range: DtDateRange) {
    this.page.start = this.datePipe.transform(range.start, "yyyy-MM-dd HH:mm:ss", '+0000');
    this.page.end = this.datePipe.transform(range.end, "yyyy-MM-dd HH:mm:ss", '+0000');
  }

  cancelFilterByDate() {
    this.page.start = "";
    this.page.end = "";
    this.page.page = 0;
    this.getOrdersList();
  }

  onPageChanged(event: PageEvent) {
    this.page.page = event.pageIndex;
    this.page.size = event.pageSize;
    this.getOrdersList();
  }

  onSelectOrder(order: RespOrder) {
    this.matDialog.open(OrderDetailsComponent, {
      width: '900px',
      data: {
        orderDetails: order
      },
      // data: {
      //   id: order.id,
      //   status: order.status,
      //   riderId: order.riderId,
      //   branchId: this.selectedStore.id,
      //   membershipType: order.membershipType,
      //   statusLog: order.orderStatusLog,
      //   timeLog: order.timeLog,
      //   tat: order.tat,
      //   appVersion: order.appVersion
      // },
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  updateStatus(id: number) {
    let index = this.orders.findIndex(order => order.id == id);
    if (index != -1) {
      this.orders[index].status = 'Confirmed';
    }
  }

  /* ON DESTROY */
  ngOnDestroy() {
    this.autoFetch.unsubscribe();
  }

}