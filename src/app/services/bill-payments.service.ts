import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillPaymentsService {
  getCategories() {
    return of([
      {
        id: 'utilities',
        name: 'Utilities',
        description: 'Electricity, Water, Gas',
        iconPath: 'M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z',
        iconBgClass: 'bg-blue-100',
        iconTextClass: 'text-blue-600'
      },
      // ... other categories
    ]);
  }

  getPaymentMethods() {
    return of([
      { id: 1, name: 'Primary Checking', maskedNumber: '**** 4567', balance: 3240.58 },
      // ... other methods
    ]);
  }

  submitPayment(paymentData: any): Observable<any> {
    // In a real app, this would be an HTTP call
    console.log('Processing payment:', paymentData);
    return of({ success: true, transactionId: 'DEMO12345' });
  }
}
