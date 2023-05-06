
export class RespStoreLibraryItemList {
    libraryItemList: RespStoreLibraryItem[];
    totalRecords: number;
}

export class RespStoreLibraryItem {
    id: number;
    metaStatus: {
        id: number;
        code: string;
    };
    title: string;
    details: string;
    category: string;
    imageId: number;
    langId: number;
    categoryId: number;
    fileUrl: string;
    fileName: string;
    statusLanguage: string;
    itemId: number;
}

export class DtTransferProduct {
    id: number;
    title: string;
    statusLanguage: string;
    itemId: number;
    selected?: boolean;
    price?: number;
    strategyId?: number;
    inventoryId?: number;
}

export interface ReqTransferProducts {
    branchItems: ReqBranchItem[];
    branchId: number;
}

export interface ReqBranchItem {
    item: {
        price: number;
        quantity: number;
        cost: number;
        barcode: number;
        netSalePrice: number;
        metaInventory: {
            id: number;
        };
        pricingStrategy: {
            id: number;
        };
    };
    statusId: number;
    libraryItemId: number;
}