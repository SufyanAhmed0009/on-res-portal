import { DtStatus } from '../models/status';
import { DtPricingStrategy } from '../models/pricing-strategy';

export class StatusConstants {

    public static STATUS_LIST: DtStatus[] = [
        {
            id: 0,
            title: "All Items",
            code: "STA000"
        },
        {
            id: 1,
            title: "Online",
            code: "STA001"
        },
        {
            id: 2,
            title: "Offline",
            code: "STA002"
        },
        {
            id: 3,
            title: "Enabled",
            code: "STA003"
        },
        {
            id: 4,
            title: "Disabled",
            code: "STA004"
        },
        {
            id: 5,
            title: "New",
            code: "STA101"
        },
        {
            id: 6,
            title: "Confirmed",
            code: "STA102"
        },
        {
            id: 7,
            title: "Order Confirmed",
            code: "STA103"
        },
        {
            id: 8,
            title: "Delivered",
            code: "STA104"
        },
        {
            id: 9,
            title: "Canceled",
            code: "STA105"
        },
        {
            id: 10,
            title: "Assigned",
            code: "STA106"
        },
        {
            id: 11,
            title: "Amended",
            code: "STA107"
        },
        {
            id: 12,
            title: "Intermediate",
            code: "STA108"
        },
        {
            id: 13,
            title: "Approved",
            code: "STA109"
        },
        {
            id: 14,
            title: "InProcessBranch",
            code: "STA110"
        },
        {
            id: 15,
            title: "Rejected",
            code: "STA111"
        },
        {
            id: 21,
            title: "Order Dispatched",
            code: "STA117"
        }
    ]

    public static PRICING_STRATEGY_LIST: DtPricingStrategy[] = [
        {
            id: 1,
            code: "AW",
            description: "Average Whole Sale"
        },
        {
            id: 2,
            code: "LW",
            description: "Last Wholesale"
        },
        {
            id: 3,
            code: "RP",
            description: "Retail Price"
        },
        {
            id: 4,
            code: "R0",
            description: "Retail - 1"
        }
    ]

}