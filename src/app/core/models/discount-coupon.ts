export class ModelDiscountCouponRequest {
    discountCouponLanguage: {
        title: string;
        details: string;
    };
    status: {
        id: number;
    };
    discountCoupon: {
        id?: number;
        code: string;
        startingDate: Date;
        expiryDate: Date;
        fileName: string;
        fileUrl?: string;
        percentage?: number;
        fixedAmount?: number;
        promocode: string;
        maxAmountPerUse: number;
        minOrderValue: number;
        maxOrderValue: number;
        totalVouchers: number;
        validity: number;
    };
    imgId?: number;
    userGroupId?: number;
}

// new Request for Discount Coupon
export class ModalDiscCouponNewRequest {
    discountCouponId?: number;
    promocode: string;
    expiryDate: string;
    startingDate: string;
    retargettedDate: string;
    title: string;
    details: string;
    percentage: number;
    additionalPercentage?: number;
    fixedAmount: number;
    orderCouponCount?: number;
    isShowNotif: boolean;
    excludeShopkeeper: boolean;
    imgId?: number;
    statusId: number;
    couponTypeId: string;
    appTypeId?: string;
    totalVouchersIssued: number;
    totalVouchers: number;
    minOrderValue: number;
    usageLimitPerCustomer?: number;
    maxAmountPerUse?: number;
    couponRanges: CouponRanges[];
    hqList?: { id: number; }[];
    isAutoApply?: boolean;
    autoApply: boolean;
    restrictDevice?: boolean;
    userRestIds?: number[];
}

export class CouponRanges {
    id?: number;
    endRange: number;
    startRange: number;
    percentage: number;
    fixedAmount: number;
}

// New Response For Disc Coupon
export class ModalDiscCouponNewResponse {
    id: number;
    title: string;
    details: string;
    fileUrl: string;
    appTypeId: string;
    appType: {
        id: number;
        code?: number;
        name: string;
    };
    percentage?: number;
    additionalPercentage?: number;
    fixedAmount?: number;
    expiryDate: number;
    startingDate: number;
    promocode: string;
    status: {
        id: number;
        code: string;
    };
    minOrderValue: number;
    orderCountCoupon: number;
    orderCouponCount?: number;
    orderAppCount?: number;
    usageLimitPerCustomer?: number;
    maxAmountPerUse?: number;
    retargettedDate: string;
    totalVouchersIssued: number;
    totalVouchers: number;
    isShowNotif: boolean;
    excludeShopkeeper: boolean;
    type: {
        id: number;
        code: string;
        title: string;
    }
    type1: {
        id: number;
        code?: string;
        name: string;
    }
    couponRange: CouponRanges[];
    discountCouponHq: DiscCouponHq[];
    autoApply: boolean;
    restrictDevice: boolean;
    discountCouponRestaurant: DiscCouponRestaurants[];
}


export class DiscCouponHq {
    createdAt: string;
    discountCouponId: number;
    hqId: number;
    hqTitle: string;
    id: number;
    updatedAt: string;
}

export class DiscCouponRestaurants {
    createdAt: string;
    discountCouponId: number;
    restaurantId: number;
    restaurantTitle: string;
    id: number;
    updatedAt: string;
}


export class ModelDiscountCouponResponse {
    id: number;
    title: string;
    details: string;
    code: string;
    percentage?: number;
    fixedAmount?: number;
    couponType: string;
    expiryDate: number;
    startingDate: number;
    validity: number;
    promocode: string;
    maxAmountPerUse: number;
    status: {
        id: number;
        code: string;
    };
    fileName: string;
    fileUrl: string;
    nature: string;
    minOrderValue: number;
    maxOrderValue: number;
    totalVouchersIssued: number;
    totalVouchers: number;
    usageLimitPerCustomer: number;
    applyTo: number;
    orderCountCoupon: number;
    isAutoApply: boolean;
}

export class ModelDiscountCouponListResponse {
    discountCouponInfo: ModelDiscountCouponResponse[];
    count: number;
}

export class ModelDiscountCouponsPage {
    page: number;
    size: number;
    branchId: string;
    couponId: string;
    title: string;
    id: string;
    phone?: string;
}

export class ModelDiscountCouponUserResponse {
    id: number;
    email: string;
    maxAmount: number;
    amountUsed: number;
    usageNumber: number;
    totalUsage: number;
    unlimited: boolean;
    discountCouponTitle: string;
    discountCouponId: number;
    userId: number;
    username: string;
    userphone: string;
    expiry: number;
    joinDate: number;
    startingDate: Date;
    expiryDate: Date;
    isSelected?: boolean;
}

export class ModelDiscountCouponUserListResponse {
    couponUserList: ModelDiscountCouponUserResponse[];
    count: number;
}

export class ModalDiscUserListRequest {
    isUpdate: number;
    couponUserList: ModalDiscUserSheetUpload[];
}
export class ModalDiscUserSheetUpload {
    id?: number;
    discountCoupon: {
        id: number;
    };
    userApp: {
        id: number;
    };
    username?: string;
    // userphone: string;
    unlimited: number;
    usageNumber: number;
    maxAmount: number;
    totalUsage: number;
    amountUsed: number;
    expiryDate: string;
    startingDate?: string;
}


export class AppTypeResponse {
    id: number;
    code?: string;
    name: string;
}