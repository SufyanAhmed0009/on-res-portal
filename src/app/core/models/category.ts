import { DaysDropDown } from "./drop-down";

export class MenuCategoryDetails {
    id?: number;
    title?: string;
    text?: string;
    fileUrl?: string;
    statusId?: number;
    statusTitle?: string;
    menuCategoryCountryList?: [
        {
            id?: number;
            country?: CategoryCountry;
        }
    ];
    menuDayList?: MenuDay[];
}

export class MenuCategoryResponse {
    count: number;
    menuList: MenuCategoryDetails[];
}

export class MenuCategoryRequest{
    count: number;
    menuCategorylist: MenuCategoryList[];
}

export class MenuCategoryList{
    fileUrl: string;
    id: number;
    title: string;
    status: CategoryStatus;
}

export class CategoryStatus {
    id?: number;
    code?: string;
    title?: string;
    statusType?: string;
    sortOrder?: string;
}

export class CategoryDay {
    id?: number;
    code?: string;
    title?: string;
    sequence?: number;
    calendarSequence?: number;
}

export class CategoryCountry {
    id?: number;
    code?: string;
    country?: string;
    timezone?: string;
    numberLength?: number;
    delivery?: boolean;
    status?: CategoryStatus;
}

export class MenuDay {
    startTime: string;
    endTime: string;
    day?: {
        id: number;
    }
    status?: {
        id: number;
    }
    workingDays?: DaysDropDown[];
}

export class AddMenuCategory {
    id?: number;
    text: string;
    title: string;
    userId?:number;
    menuDay?: MenuDay[];
    menuCategoryCountry?: CategoryCountry[];
    status?: {
        id: number;
    }
    language?: {
        id: number;
    }
    restaurant?: {
        id: number;
    }
    fileContent?: string;
}

export class CategoryDetails {
    categoryId: number;
}

