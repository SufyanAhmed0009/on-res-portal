import { DtLanguage } from './language'
export class DtPage {
  id?: number;
  languageId?: number;
  page: number;
  size: number;
  title?: string;
  date?: string;
  statusId?: number;
  branchId?: number;
  restId?: number;
  userRestaurants?: number[];
}

export class DtOrdersPage {
  size: number;
  page: number;
  id: number;
  statusId: number;
  end: string;
  start: string; // Format: "2019-11-08 18:28:04"
  userId: number;
  hqId: number;
  orderBy: string;
  branchId?: number;
  restId?: number;
}

export class DtPageInfo {
  size?: number;
  page?: number;
  pageStart?: number;
  pageSize?: number;
  id?: number;
  title?: string;
  offset?: number;
  languageId?: number;
  membershipId?: number;
  metaStatus?: {
    id: number;
  };
  restaurant?: {
    id: number;
  };
  hq?: number;
  barcode?: string;
  date?: string;
  statusId?: number;
  firstName?: string;
  isPromoter?: boolean;
  phone?: string;
  hqId?: number;
  start?: string;
  end?: string;
  userId?: number;
  catId?: number
  subCatId?: number;
  countryId?: number;
  userCountryList?: number[];
  userHqList?: number[];
  userCityList?: number[];
  riderId?: number;
  accountId?: number;
  coaId?: number;
  transactionId?: number;
  language?: DtLanguage;
  restId?: number;
  modGroup?: number;
  restIds?: number[];
  sliderTypeId?: number;
  itemIds?: number[];
  restaurantId?: number;
}