import { Injectable } from '@angular/core';
import { ModelStatus } from '../models/restaurant-menu';

@Injectable({
  providedIn: 'root'
})
export class ServiceStatus {

  constructor() { }

  getEnableDisabledStatuses(){
    let list: number[] = [3, 4];
    return this.getListOfAllStatuses().filter(
      (item) => {
        return list.indexOf(item.id) != -1;
      }
    );
  }
  
  getListOfAllStatuses(): ModelStatus[] {
    return [
      { id: 1, title: "Online", code: "STA001" },
      { id: 2, title: "Offline", code: "STA002" },
      { id: 3, title: "Enabled", code: "STA003" },
      { id: 4, title: "Disabled", code: "STA004" },
      { id: 5, title: "New", code: "STA101" },
      { id: 6, title: "Confirmed", code: "STA102" },
      { id: 7, title: "Order Confirmed", code: "STA103" },
      { id: 8, title: "Delivered", code: "STA104" },
      { id: 9, title: "Canceled", code: "STA105" },
      { id: 10, title: "Assigned", code: "STA106" },
      { id: 11, title: "Amended", code: "STA107" },
      { id: 12, title: "Intermediate", code: "STA108" },
      { id: 13, title: "Approved", code: "STA109" },
      { id: 14, title: "InProcessBranch", code: "STA110" },
      { id: 15, title: "Rejected", code: "STA111" }
    ];
  }
}
