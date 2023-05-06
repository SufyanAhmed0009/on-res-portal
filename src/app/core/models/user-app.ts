export class ResponseUserDetails {
    id: number;
    firstName: string;
    lastName: string;
    memberShipTypeInfo: {
        code: string;
        color: string;
        title: string;
    }
    orderCount: number;
    primaryhq: {
        id: number;
        title: string;
    }
    phone: string;
    email: string;
    installationId: string;
    username: string;
}


export class ModelMembershipInfo {
    id?: number;
    title: string;
    code: string;
    color: string;
    priorty?: any;
    amount: number;
    totalCriteria?: any;
    fileName?: any;
    fileUrl?: any;
    info?: any;

}

export class MembershipCouponRequest {
    phone?: number; 
countryId?: number;
    membershipId?: number;
    couponId: number;
    couponTotalUsage: number;
    couponMaxAmount: number;
    couponUsageTime: boolean;
    couponStartingDate: String;
    couponExpiryDate: String;
}
