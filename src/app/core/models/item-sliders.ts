import { ModelStatus } from "./restaurant-menu";

export class ItemSilderListResponse {
    count: number;
    itemSliderList: ItemSilderResponse[];
}

export class ItemSilderResponse {
    id: number
    code: string;
    sortOrder: number;
    title: string;
    status: ModelStatus;
    itemList: {
        id: number;
        title: string;
        details: string;
    }[];
}

export class ModalAddSlider {
    id?: number;
    title: string;
    code: string;
    sortOrder: number;
    statusId: number;
    restId: number;
}


