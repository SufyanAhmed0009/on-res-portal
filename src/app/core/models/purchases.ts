export class ReqPurchase {
    branchPurchaseList: ReqPurchaseItem[];
    purchaseTransaction: {
        branch: {
            id: number;
        }
    }
}

export class ReqPurchaseItem {
    item: {
        id: number;
    };
    branch: {
        id: number;
    };
    quantity: number;
    cost: number;
    pricingStrategy: {
        id: number;
    };
    price?: number;
}

export class RespPurchase {
    id: number;
    title: string;
    tsServer: number;
    totalCost: number;
}

export class RespPurchaseList {
    transactionList: RespPurchase[];
    count: number;
}

export class RespPurchaseItem {
    id: number;
    title: string;
    cost: number;
    quantity: number;
}