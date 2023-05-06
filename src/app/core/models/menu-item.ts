export class MenuItemList {
    menuItemlist?: MenuItem[]
    count?: number

}

export class MenuItem {
    id?: number;
    title?: String;
    status?: String;
    price?: number;
    gst?: number;
    discountPrice?: number;
    isSelected?: boolean;
}