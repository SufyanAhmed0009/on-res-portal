import { Direction } from '@angular/cdk/bidi';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModelNotificationsListResponse, ModelNotificationsResponse } from 'src/app/core/models/notification';
import { DtPage, DtPageInfo } from 'src/app/core/models/page';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceLanguage } from 'src/app/core/services/language.service';
import { ServiceNotification } from 'src/app/core/services/notification.service';
import { ServiceSnackbar } from 'src/app/core/services/snackbar.service';
import { ModalCreateNotificationComponent } from '../modal-create-notification/modal-create-notification.component';
import { ModalEditNotificationComponent } from '../modal-edit-notification/modal-edit-notification.component';
import { ModalNotificationUsersComponent } from '../modal-notification-users/modal-notification-users.component';

@Component({
  selector: 'app-manage-notifications',
  templateUrl: './manage-notifications.component.html',
  styleUrls: ['./manage-notifications.component.css']
})
export class ManageNotificationsComponent implements OnInit {

  /* NOTIFICATION LIST */
  notificationsList: ModelNotificationsResponse[];

  /* PAGINATION */
  currentPage: DtPage;
  totalNumberOfRecords: number;
  isLoading: boolean = false;

  /* COLUMNS LIST */
  columnsList = [
    'id',
    'title',
    'details',
    'type',
    'reached',
    'users',
    'actions'
  ]



  constructor(
    private matDialog: MatDialog,
    private notificationsService: ServiceNotification,
    private languageService: ServiceLanguage,
    private snackBarService: ServiceSnackbar,
    private authService: ServiceAuth
  ) { }

  ngOnInit(): void {

    this.initVariables();
    this.getListOfNotifications();
    
     /* UPDATE DATA WHEN ADDING OR UPDATING NEW CITY */
     this.notificationsService.dataUpdated.subscribe(
      () => {
        this.getListOfNotifications();
      }
    );

  }

  /* INITIALIZING VARIABLES */

  initVariables() {
    this.currentPage = {
      size: 10,
      page: 0
    }
    // const filters = this.authService.getUserFilters();
    // this.currentPage.userHqList = filters.franchises;
  }

  getListOfNotifications() {

    this.isLoading = true;
    this.notificationsService.getNotificationsList(this.currentPage).subscribe(
      (response: ModelNotificationsListResponse) => {
        console.log("notification List")
        console.log(response)
        this.notificationsList = response.notifs;
        this.totalNumberOfRecords = response.count;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.snackBarService.showErrorMessage("Error Fetching Data!");
      }
    )

  }

  /* ON REFRESH */
  onRefresh() {
    this.getListOfNotifications();
  }

  /* ON PAGE CHANGE */
  onPageChanged($event: { previousPageIndex: number, pageIndex: number, pageSize: number, length: number }) {

    this.currentPage.page = $event.pageIndex;
    this.currentPage.size = $event.pageSize;
    this.getListOfNotifications();

  }

  createNotification() {
    let dialogRef = this.matDialog.open(ModalCreateNotificationComponent, {
      width: '600px',
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

  sendNotification(notification: ModelNotificationsResponse) {

  }

  onEdit(notification: ModelNotificationsResponse){
    let dialogRef = this.matDialog.open(ModalEditNotificationComponent, {
      width: '600px',
      data: notification,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
    dialogRef.afterClosed().subscribe(
      (result: boolean) => {
        if (result){
          this.onRefresh();
        }
      }
    );
  }

  onManageUsers(notification: ModelNotificationsResponse){
    this.matDialog.open(ModalNotificationUsersComponent, {
      width: '600px',
      data: notification,
      direction: <Direction>this.languageService.getCurrentLanguage().dir,
      autoFocus: false,
      maxHeight: '90vh'
    });
  }

}

