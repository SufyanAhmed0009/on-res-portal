import { DtStatus } from "./status";

export class RespMenuList {
    menuItems: MenuCategory[];
    count: number;
    categoryId: number;
    categoryTitle: string;
}

export class MenuCategory {
    id: number;
    created: string;
    updated: string;
    status: {
        id: number;
        code: string;
        title: string;
        statusType: string;
        sortOrder: string;
    };
    price: number;
    cost: number;
    gst: number;
    menuItemLanguage: string;
    menuItemSizes: string;
    quantity: string;
    url: string;
    title: string;
    details: string;
    categoryTitle: string;
    categoryId: number;
    isEnabled: boolean;
    modifierItemList: [
        {
            modifierGroupId: number;
            modifierGroupTitle: string;
            minQuantity: number;
            maxQuantity: number;
            modifiersList: [
                {
                    groupId: number;
                    modifierId: number;
                    groupTitle: string;
                    modifierTitle: string;
                    modifierDetails: string;
                    groupMinQuantity: number;
                    groupMaxQuantity: number;
                    modifierPrice: number;
                    menuItemId: number;
                    status: DtStatus;
                    isEnabled: boolean;
                }
            ]
        }
    ]
    modifierList: string;
    updatedBy: string;
    createdBy: string;
}

export class FilterItem {
    title: string;
    value: number;
}

export class MenuResponse {
    categoryId: number;
    categoryTitle: string;
    menuCategory: string;
    menuItems: {
        categoryId: number;
        categoryTitle: string;
        cost: number;
        created: string;
        createdBy: string;
        dealId: number;
        details: string;
        gst: number;
        id: number;
        menuItemLanguage: string;
        menuItemSizes: string;
        modifierItemList: string;
        modifierList: string;
        price: number;
        quantity: number;
        status: {
            id: number;
            code: string;
            title: string;
            statusType: string;
            sortOrder: string;
        };
        title: string;
        updated: string;
        updatedBy: string;
        url: string;
        isEnabled?: Boolean;
    }[];
}

export class ModelStatus {
    id: number;
    title: string;
    code?: string;
}
export class Dropdown {
    id?: number;
    title?: string;
    checked?: boolean;
    price?: number;
    status?: { id?: number, code?: string, title?: string, statusType?: string }
    isBasePrice?: boolean;
    discountPrice?: number;
    statusEnabled?: boolean = false;
    isAlready?: boolean = false;

}


export class UpdateStatusRequest {
    status: {
        id: number;
    };
    id: number;
}

export class UpdateStatusResponse {
    id: number;
    created: number;
    updated: number;
    status: {
        id: number;
        code: string;
        title: string;
        statusType: number;
        sortOrder: number;
    };
    price: number;
    cost: number;
    gst: number;
    menuItemLanguage: [
        {
            id: number;
            title: string;
            text: string;
            language: {
                id: number;
                title: string;
                code: string;
                langCode: string;
                default: boolean;
            }
        }
    ];
    menuItemSizes: [];
    quantity: number;
    url: string;
    title: string;
    details: string;
    categoryTitle: string;
    categoryId: number;
    dealId: number;
    modifierItemList: string;
    modifierList: string;
    createdBy: string;
    updatedBy: string;
    isEnabled: boolean;
}

export class ModifierItem {
    modifierGroupId: number;
    modifierGroupTitle: string;
    minQuantity: number;
    maxQuantity: number;
    modifiersList: Modifier[];
}

export class Modifier {
    groupId?: number;
    modifierId?: number;
    groupTitle?: string;
    modifierTitle?: string;
    modifierDetails?: string;
    groupMinQuantity?: number;
    groupMaxQuantity?: number;
    modifierPrice?: number;
    menuItemId?: number;
    isEnabled?: boolean;
}

export class RestaurantMenuCategoryRequest {
    pageSize: number;
    pageStart: number;
    title: string;
    restaurant: {
        id: number;
    };
    language: {
        id: number,
        name: string
    }
}
