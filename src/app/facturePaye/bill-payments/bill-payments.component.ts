import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bill-payments',
  templateUrl: './bill-payments.component.html',
  standalone:false,
  styleUrls: ['./bill-payments.component.css']
})
export class BillPaymentsComponent implements OnInit {
  activeTab: string = 'pay';
  selectedProvider: any = null;
  selectedCategory: string = '';

  constructor() { }

  ngOnInit(): void {
    this.setDefaultPaymentDate();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    this.selectedProvider = null;
  }

  onProviderSelected(provider: any): void {
    this.selectedProvider = provider;
    this.activeTab = 'pay';
  }

  onPaymentSubmit(paymentData: any): void {
    console.log('Payment submitted:', paymentData);
    // Handle payment submission logic here
    this.selectedProvider = null;
  }

  private setDefaultPaymentDate(): void {
    // This would be handled in the payment form component
  }
}
