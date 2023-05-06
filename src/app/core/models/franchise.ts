export class FranchiseListResponse {
    id: number;
    title: string;
    lat: string;
    lon: string;
    address: string;
    minOrderAmount: number;
    status: {
        id: number;
        title: string;
        code?: string;
        statusType?: string;
    }
    phone1: string;
    phone2: string;
    details: string;
    timeOpen: string;
    timeClose: string;
    countryCode: string;
    countryTitle: string;
    cityId: number;
    cityTitle: string;
    orderCompletionTime: number;
    isExpressedDelivery: boolean;
    isScheduledDelivery: boolean;
    isNextDay: boolean;
}
