import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModelNotificationsResponse, ModelNotificationsUserResponse } from 'src/app/core/models/notification';
import { ServiceAuth } from 'src/app/core/services/auth.service';
import { ServiceNotification } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-modal-notification-users',
  templateUrl: './modal-notification-users.component.html',
  styleUrls: ['./modal-notification-users.component.css']
})
export class ModalNotificationUsersComponent implements OnInit {

  isLoading: boolean;
  usersList: ModelNotificationsUserResponse[];

  /* RIGHTS */
  showSensitiveInfo: boolean;

  columnsList = [
    'id',
    'username',
    'email',
    'read'
  ]; 

  constructor(
    @Inject(MAT_DIALOG_DATA) private notification: ModelNotificationsResponse,
    private notificationsService: ServiceNotification,
    private authService: ServiceAuth
    ) { }

  ngOnInit(): void {
    // this.showSensitiveInfo = this.authService.getShowSensitiveInfo();
    this.isLoading = true;
    this.notificationsService.getNotificationUsers(this.notification.id).subscribe(
      (data: ModelNotificationsUserResponse[]) => {
        this.usersList = data;
        this.isLoading = false;
      }
    );

  }

}
