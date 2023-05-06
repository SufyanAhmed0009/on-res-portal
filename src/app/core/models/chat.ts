export class ModelMessageResponse {
    id?: number;
    message: string;
    sendAt: number;
    time?: Date;
    userId: string;
    fromUser: boolean;
    ccid: number;
    fromId?: number;
    toId?: number;
    userName?: string;
    messageList?: ModelListMessage[];
    phone?: string;
    isRead?: boolean;
    issue?: boolean;
    ccName?: string;
    hqId?: number;
    url?: string;
    filePresent?: boolean;
    appType?: string;
    appTypeTitle?: string;
}

export class ModelListMessage {
    id: number;
    message: string;
    time: Date;
    toId: number;
    fromUser: boolean;
    sendAt?: number;
    ccName?: string;
    isImage?: boolean;
    imageUrl?: string;
    filePresent?: boolean;
    sendFile?: boolean;
    url?: string;
    appType?: string;
    appTypeTitle?: string;
}

export class DtUserMessage {
    id: number;
    message: string;
    user: string;
    time: number;
    date: Date;
    read: boolean;
    issue: boolean;
    hqId?: number;
    isImage?: boolean;
    imageUrl?: string;
    filePresent?: boolean;
    sendFile?: boolean;
    url?: string;
    appType?: string;
    appTypeTitle?: string;
}

export class DtSelectedUserMessage {
    message: string;
    time: number;
    date: Date;
    from: boolean;
    ccName: string;
    isImage?: boolean;
    imageUrl?: string;
    filePresent?: boolean;
    sendFile?: boolean;
    url?: string;
    appType?: string;
    appTypeTitle?: string;
}

export class ReqSendImageMessage {
    message: null;
    userId: number;
    fromUser: boolean;
    sendFile: boolean;
    filePresent: boolean;
    sendAt: string;
    fileContent: string;
    ccId: number;
}

export class ModelMessagePageInfo {
    chatMessages?: {
      userId: string;
    };
    listStart: number;
    listSize: number;
  }  

export class AppType {
    id: number;
    code: string;
    name: string;
}