export class ModelNotificationsResponse {
    id: number;
    title: string;
    details: string;
    notifType: string;
    notifReach: string;
    sendNotif: boolean;
    userIds: number[];
    appType:{
        id: number;
        code?: number;
        name: string;
       };
}

export class ModelNotificationUpdateRequest {
    id: number;
	statusId: number;
	title: string;
	description: string;
	langId: number;
    appTypeId:number;
}

export class ModelNotificationsListResponse {
    notifs: ModelNotificationsResponse[];
    count: number;
}

export class ModelNotificationRequest {
    title: string;
    details: string;
    userIds: number[];
    notifReach: string;
    notifType: string;
    sendNotif: boolean;
    langId: number;
    langCode: string;
    popUp: boolean;
    imgId: number;
    imgUrl: string;
    expiryDate: string;
    hqIds? : number[];
    appTypeId:number;
    sendDate?:string
}

export class ModelNotificationsUserResponse {
    id: number;
    notifId: number;
    userPhone: string;
    isRead: boolean;
    userEmail: string;
    userName: string;
    userId: number;
}

export class ModalUserSheetUpload {
    users: [
        {
            id: number;
            title: string;
        }
    ]
}