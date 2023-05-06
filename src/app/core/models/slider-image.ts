export class SliderImageResponse {
  fileName: string;
  isFeelLuck: boolean;
  mainPage: boolean;
  sortOrder: number;
  fileUrl: string;
  navigationPath: string;
  id: number;
  status: string;
  hqList: {
    id: number;
    title: string
  }[];
  appType: {
    id: number;
    code?: number;
    name: string;
  }
}

export class SliderImageListResponse {
  pages: number;
  size: number;
  count: number;
  imgList: SliderImageResponse[];
}

export class SliderImageRequest {
  id?: number;
  imgId: number;
  navigationPath: string
  status: {
    id: number;
  }
  fileName: string;
  isMainPage: boolean;
  sortOrder: number;
  // isFeellucky: boolean;
  appType: {
    id: number;
  }
  restaurantId: number;
}

