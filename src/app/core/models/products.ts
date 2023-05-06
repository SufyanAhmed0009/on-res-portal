export class RespStoreProductsList {
    branchItems: RespStoreProduct[];
    totalRecords: number;
}

export class RespStoreProduct {
    id: number;
    title: string;
    name?: string;
    details?: string;
    barcode: string;
    branchId?: number;
    fileUrl?: string;
    fileName?: string;
    cost: number;
    price: number;
    discountAmount: number;
    netSalePrice: number;
    quantity: number;
    minQuantity: number;
    maxQuantity: number;
    isSelected?: boolean;
    isAlreadyAdded?: boolean;
    selectedQuantity?: number;
    isEnabled?: boolean;
    status?: {
        id: number;
        code: string;
    };
    inventoryId?: number;
    pricingStrategyId: number;
}

export class ReqStoreProductsUpdateList {
    branchItems: {
        item: {
            id?: number;
            price: number;
            quantity: number;
            minQuantity: number;
            maxQuantity: number;
            cost: number;
            discountAmount: number;
            netSalePrice: number;
            barcode?: string;
            metaInventory: {
                id: number;
            },
            pricingStrategy: {
                id: number;
            }
        }
        libraryItemId?: number;
        statusId?: number;

    }[];
    branchId?: number;
}

export class DtStoreOfflineProduct {
    barcode: string;
    cost: number;
    discountAmount: number;
    id: number;
    netSalePrice: number;
    price: number;
    quantity: number;
    title: string;
    name: string;
}

export class DtPurchaseProduct {
    id: number;
    name: string;
    barcode: string;
    quantity?: number;
    cost?: number;
    price?: number;
    strategyId: number;
}

export class ReqPasswordProductUpdate {
    itemList: {
        itemId: number;
        price: number;
        quantity: number;
        branchId: number;
        status: {
            id: number;
        }
    }[];
}