import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../modele/Transaction';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class TransactionDetailComponent {
  @Input() transaction: Transaction | null = null;
  @Output() close = new EventEmitter<void>();
  
  constructor() {}
  
  closeDetail(): void {
    this.close.emit();
  }
  
  formatDate(date: Date | undefined): string {
    return date ? new Date(date).toLocaleString() : '';
  }
  
  formatAmount(amount: number | undefined): string {
    return amount ? amount.toFixed(2) : '0.00';
  }
  
  getTypeClass(type: string | undefined): string {
    return type === 'Entrante' ? 'text-green-600' : 'text-red-600';
  }

  onBackdropClick(event: MouseEvent): void {
    // Only close if they clicked directly on the backdrop, not on the modal content
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeDetail();
    }
  }
}