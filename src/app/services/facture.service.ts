import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private bills = [
    {
      provider: 'CityPower Electric',
      account: '#EL-78945612',
      amount: 89.99,
      dueDate: new Date('2023-05-28'),
      status: 'paid',
      color: 'yellow',
      icon: '<path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"></path>'
    },
    // Add other bills...
  ];

  getBills() {
    return this.bills;
  }

  // Add other service methods...
}