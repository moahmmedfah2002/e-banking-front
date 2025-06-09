import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../modele/Transaction';
import { AgentTransactionService } from '../../services/agent-services/agent-transaction/agent-transaction.service';
import { TransactionAgentFormComponent } from './transaction-form/transaction-form.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

@Component({
  selector: 'app-transaction-agent',
  standalone: false,
  templateUrl: './transaction-agent.component.html',
  styleUrl: './transaction-agent.component.css'
})
export class TransactionAgentComponent implements OnInit {
  // List of transactions
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  // Statistics
  totalTransactions = 0;
  totalIncoming = 0;
  totalOutgoing = 0;
  
  // Filter options
  filterType: 'all' | 'Entrante' | 'Sortante' = 'all';
  filterStatus: 'all' | 'Completed' | 'Pending' = 'all';
  searchQuery = '';
  
  // Loading state
  loading = true;
  
  // UI state
  selectedTransaction: Transaction | null = null;
  showTransactionForm = false;
  showTransactionDetail = false;
  
  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 1;
  
  constructor(private transactionService: AgentTransactionService) {}
  
  ngOnInit(): void {
    this.loadTransactions();
  }
  loadTransactions(): void {
    this.loading = true;
    
    // Get transaction stats
    this.transactionService.getTransactionStats().subscribe({
      next: (stats) => {
        this.totalTransactions = stats.totalTransactions;
        this.totalIncoming = stats.totalIncoming;
        this.totalOutgoing = stats.totalOutgoing;
      },
      error: (error) => {
        console.error('Error loading transaction stats:', error);
        this.loading = false;
      }
    });
    
    // Get paginated transactions with filters
    this.transactionService.getPaginatedTransactions({
      page: this.currentPage,
      pageSize: this.pageSize,
      type: this.filterType !== 'all' ? this.filterType : undefined,
      status: this.filterStatus !== 'all' ? this.filterStatus : undefined,
      searchQuery: this.searchQuery || undefined
    }).subscribe({
      next: (result) => {
        this.filteredTransactions = result.transactions;
        this.totalItems = result.total;
        this.totalPages = Math.ceil(result.total / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
      }
    });
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }
  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when applying filters
    this.loadTransactions();
  }
    resetFilters(): void {
    this.filterType = 'all';
    this.filterStatus = 'all';
    this.searchQuery = '';
    this.loadTransactions();
  }
    selectTransaction(transaction: Transaction): void {
    this.selectedTransaction = transaction;
    this.showTransactionDetail = true;
  }
  
  closeTransactionDetail(): void {
    this.showTransactionDetail = false;
    this.selectedTransaction = null;
  }
  
  formatDate(date: Date | undefined): string {
    return date ? new Date(date).toLocaleString() : '';
  }
  
  getTypeClass(type: string | undefined): string {
    return type === 'Entrante' ? 'text-green-600' : 'text-red-600';
  }
  formatAmount(amount: number | undefined): string {
    return amount ? amount.toFixed(2) : '0.00';
  }
  
  toggleTransactionForm(): void {
    this.showTransactionForm = !this.showTransactionForm;
    // If we're showing the form, add a class to prevent scrolling of the background
    if (this.showTransactionForm) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
    closeTransactionForm(): void {
    this.showTransactionForm = false;
    document.body.classList.remove('overflow-hidden');
  }    handleNewTransaction(transaction: Transaction): void {
    this.transactionService.createTransaction(transaction).subscribe({
      next: () => {
        this.showTransactionForm = false;
        // Reload transactions to refresh the list with proper pagination and updated stats
        this.loadTransactions();
      },
      error: (error) => {
        console.error('Error creating transaction:', error);
        // You might want to show an error message to the user here
      }
    });
  }
}
