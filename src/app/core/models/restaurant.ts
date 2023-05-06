import { DaysDropDown } from "./drop-down";

export class RestaurantDetails {
    id?: number;
    created?: number;
    updated?: number;
    phone?: string;
    isEnabler?: boolean;
    restaurantLanguages?: RestaurantLanguage[];
    restaurantCountries?: RestaurantCountry[];
    restaurantTimings?: RestaurantTiming[];
    restaurantCuisines?: RestaurantCuisine[];
    restaurantFranchise?: RestaurantFranchise[];
    isHomeChef?: boolean;
    hasDelivery?: boolean;
    address?: string;
    lat?: string;
    lon?: string;
    rating?: number;
    processingTime?: number;
    discountPercentage?: number;
    fileName?: string;
    fileUrl?: string;
    businessType?: BusinessType;
    status?: RestaurantStatusDetails;
    createdBy?: number;
    updatedBy?: number;
}

export class RestaurantLanguage {
    id?: number;
    language?: RestaurantLanguageDetails;
}

export class RestaurantCountry {
    id?: number;
    country?: RestaurantCountryDetails;
}

export class RestaurantTiming {
    id?: number;
    day?: RestaurantDayDetails;
    startTime?: string;
    endTime?: string;
    status?: RestaurantStatusDetails;
    restaurant?: {
        id: number;
    };
    workingDays?: DaysDropDown[];
}

export class RestaurantCuisine {
    id?: number;
    cusine?: {
        id?: number;
        title?: string;
        status?: RestaurantStatusDetails;
        code?: string;
        country?: RestaurantCountryDetails;
        fileContentCompressed?: string;
        fileUrl?: string;
    };
    createdBy?: number;
    updatedBy?: number;
}

export class RestaurantFranchise {
    id?: number;
    hq?: number;
    isPrimary?: boolean;
    deliveryCharges?: number;
    isLucky?: boolean;
}

export class RestaurantStatusDetails {
    id?: number;
    code?: string;
    title?: string;
    statusType?: string;
    sortOrder?: string;
}

export class RestaurantDayDetails {
    id?: number;
    code?: string;
    title?: string;
    sequence?: number;
    calendarSequence?: number;
}

export class RestaurantCountryDetails {
    id?: number;
    code?: string;
    country?: string;
    timezone?: string;
    numberLength?: number;
    delivery?: boolean;
}

export class RestaurantLanguageDetails{
    id?: number;
    code?: string;
    title?: string;
    langCode?: string;
    default?: boolean;
}

export class AddRestaurant {
    tagged?: boolean;
    userId?: number;
    restaurant: {
        id?: number;
        isHomeChef?: boolean;
        hasDelivery: boolean;
        businessType: {
            id: number;
        },
        status: {
            id: number;
        }
        lat: string;
        lon: string;
        phone: string;
        address: string;
        processingTime: number;

    };
    restaurantLanguages: RestaurantLanguage[];
    restaurantCountries: RestaurantCountry[];
    restaurantTimings: RestaurantTiming[];
    restaurantCuisines: RestaurantCuisine[];
    fileContent?: string;
    replicateRestaurant?:
        {
            id?: number;
        }

}

export class BusinessType {
    id: number;
    title: string;
    details: null;
    code: string;
    status: {
        id: number;
        code: string;
        title: string;
        statusType: string;
    }
}

