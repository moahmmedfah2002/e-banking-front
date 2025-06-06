import { Component, OnInit } from '@angular/core';
import { CryptoService, CryptoTransaction } from '../../crypto.service';
import { BinanceCommunicationService } from '../../services/binance-communication.service';

@Component({
  selector: 'app-crypto-history',
  standalone: false,
  templateUrl: './crypto-history.component.html',
  styleUrl: './crypto-history.component.css'
})
export class CryptoHistoryComponent implements OnInit {
  // List of crypto transactions
  transactions: CryptoTransaction[] = [];
  filteredTransactions: CryptoTransaction[] = [];
  
  // Statistics
  totalTransactions = 0;
  activeCryptos = 0;
  totalBought = 0;
  totalSold = 0;
  
  // Filter options
  filterType: 'all' | 'buy' | 'sell' = 'all';
  filterStatus: 'all' | 'completed' | 'pending' | 'failed' = 'all';
  filterSymbol = '';
  searchQuery = '';
  
  // Crypto rates
  currentRates: Record<string, number> = {};
  
  // Loading state
  loading = true;
  
  // UI state
  selectedTransaction: CryptoTransaction | null = null;
  
  // Modal state
  isModalVisible = false;
  
  constructor(
    private cryptoService: CryptoService,
    private binanceService: BinanceCommunicationService
  ) {}
  
  ngOnInit(): void {
    this.loadTransactions();
    this.subscribeToRates();
  }
  
  // Open the transaction modal
  openTransactionModal(): void {
    this.isModalVisible = true;
  }
  
  // Handle transaction complete event from modal
  onTransactionComplete(transaction: CryptoTransaction): void {
    this.loadTransactions(); // Reload transactions to include the new one
  }
  
  // Close the transaction modal
  closeTransactionModal(): void {
    this.isModalVisible = false;
  }
  
  loadTransactions(): void {
    this.loading = true;
    this.cryptoService.getCryptoTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...data];
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading crypto transactions:', error);
        this.loading = false;
      }
    });
  }
  
  subscribeToRates(): void {
    // Subscribe to bitcoin rate
    this.binanceService.getBitcoinRate().subscribe(rate => {
      this.currentRates['BTC'] = rate.price;
    });
    
    // Subscribe to ethereum rate
    this.binanceService.getEthereumRate().subscribe(rate => {
      this.currentRates['ETH'] = rate.price;
    });
    
    // Subscribe to cardano rate
    this.binanceService.getCardanoRate().subscribe(rate => {
      this.currentRates['ADA'] = rate.price;
    });
    
    // Subscribe to solana rate
    this.binanceService.getSolanaRate().subscribe(rate => {
      this.currentRates['SOL'] = rate.price;
    });
  }
  
  calculateStats(): void {
    // Total transactions count
    this.totalTransactions = this.transactions.length;
    
    // Count unique cryptocurrencies
    const uniqueSymbols = new Set(this.transactions.map(t => t.symbol));
    this.activeCryptos = uniqueSymbols.size;
    
    // Calculate total bought and sold
    this.totalBought = this.transactions
      .filter(t => t.type === 'buy' && t.status === 'completed')
      .reduce((sum, t) => sum + t.total, 0);
      
    this.totalSold = this.transactions
      .filter(t => t.type === 'sell' && t.status === 'completed')
      .reduce((sum, t) => sum + t.total, 0);
  }
  
  applyFilters(): void {
    this.filteredTransactions = [...this.transactions];
    
    // Apply type filter
    if (this.filterType !== 'all') {
      this.filteredTransactions = this.filteredTransactions.filter(t => t.type === this.filterType);
    }
    
    // Apply status filter
    if (this.filterStatus !== 'all') {
      this.filteredTransactions = this.filteredTransactions.filter(t => t.status === this.filterStatus);
    }
    
    // Apply symbol filter
    if (this.filterSymbol) {
      this.filteredTransactions = this.filteredTransactions.filter(t => 
        t.symbol.toLowerCase() === this.filterSymbol.toLowerCase());
    }
    
    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredTransactions = this.filteredTransactions.filter(t => 
        t.id.toLowerCase().includes(query) || 
        t.symbol.toLowerCase().includes(query));
    }
  }
  
  resetFilters(): void {
    this.filterType = 'all';
    this.filterStatus = 'all';
    this.filterSymbol = '';
    this.searchQuery = '';
    this.filteredTransactions = [...this.transactions];
  }
  
  selectTransaction(transaction: CryptoTransaction): void {
    this.selectedTransaction = transaction;
    // In a real app, you might show a modal or navigate to a details page
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  getTypeClass(type: string): string {
    return type === 'buy' ? 'text-green-600' : 'text-red-600';
  }
}
