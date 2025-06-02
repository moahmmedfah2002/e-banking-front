import { Component, Input, OnInit } from '@angular/core';

interface TransactionSummary {
  thisMonth: number;
  lastMonth: number;
  average: number;
  percentChange: number;
  isIncrease: boolean;
}

@Component({
  selector: 'transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.css'],
  standalone: false
})
export class TransactionSummaryComponent implements OnInit {
  @Input() userId: number | undefined;
  
  summary: TransactionSummary = {
    thisMonth: 0,
    lastMonth: 0,
    average: 0,
    percentChange: 0,
    isIncrease: false
  };
  
  loading: boolean = true;

  constructor() {}

  ngOnInit(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.generateMockSummary();
      this.loading = false;
    }, 800);
  }

  generateMockSummary(): void {
    // Generate mock data
    const thisMonth = Math.floor(Math.random() * 10000) + 5000;
    const lastMonth = Math.floor(Math.random() * 10000) + 5000;
    const average = Math.floor((thisMonth + lastMonth) / 2);
    
    const difference = thisMonth - lastMonth;
    const percentChange = lastMonth > 0 ? Math.abs(Math.round((difference / lastMonth) * 100)) : 0;
    
    this.summary = {
      thisMonth,
      lastMonth,
      average,
      percentChange,
      isIncrease: difference > 0
    };
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  }
}
