import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../modele/Transaction';
import { MOCK_TRANSACTIONS, USER_ACCOUNTS } from '../../modele/mock-transactions';

@Component({
  selector: 'app-recent-transaction',
  standalone: false,
  templateUrl: './recent-transaction.component.html',
  styleUrl: './recent-transaction.component.css'
})
export class RecentTransactionComponent implements OnInit {
  transactions: Transaction[] = [];
  userAccounts: string[] = [];

  ngOnInit(): void {
    this.transactions = MOCK_TRANSACTIONS;
    this.userAccounts = USER_ACCOUNTS;
  }

  getTransactionDescription(transaction: Transaction): string {
    // This could be enhanced with more specific descriptions based on transaction types
    if (this.isIncomingTransaction(transaction)) {
      return 'Deposit';
    } else {
      return 'Payment';
    }
  }

  formatAmount(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return `${this.isPositiveAmount(amount) ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;
  }

  isPositiveAmount(amount: number | undefined): boolean {
    return amount !== undefined && amount > 0;
  }

  isIncomingTransaction(transaction: Transaction): boolean {
    return transaction.compteAcredit !== undefined && 
           this.userAccounts.includes(transaction.compteAcredit);
  }

  isUserAccount(accountNumber: string | undefined): boolean {
    return accountNumber !== undefined && this.userAccounts.includes(accountNumber);
  }

  getAmountClass(transaction: Transaction): string {
    // If the account debited is the user's account, it's an outgoing payment (red)
    // Otherwise, it's an incoming payment (green)
    return this.isUserAccount(transaction.compteAdebit) ? 'text-red-600' : 'text-green-600';
  }

  getIconClass(transaction: Transaction): string {
    // For outgoing payments, show down arrow with blue background
    // For incoming payments, show up arrow with green background
    return this.isUserAccount(transaction.compteAdebit) ? 
      'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600';
  }

  getIconPath(transaction: Transaction): string {
    // Down arrow for outgoing, up arrow for incoming
    return this.isUserAccount(transaction.compteAdebit) ? 
      'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7';
  }
}
