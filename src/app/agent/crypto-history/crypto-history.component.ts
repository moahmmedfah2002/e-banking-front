import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CryptoService, CryptoTransaction } from '../../crypto.service';
import { BinanceCommunicationService } from '../../services/binance-communication.service';
import { AgentCryptoService } from '../../services/agent/agent-crypto.service';
import { AgentTransactionService } from '../../services/agent/agent-transaction.service';
import { 
  AgentCryptoTransaction, 
  CryptoPriceData, 
  PriceDataPoint, 
  CryptoStatistics 
} from '../../models/agent/crypto.model';
import { interval, Subscription } from 'rxjs';
import { Chart } from 'chart.js';

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
  binanceConnection = inject(BinanceCommunicationService);  

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
  constructor(
    private cryptoService: CryptoService,
    private binanceService: BinanceCommunicationService,
    private agentCryptoService: AgentCryptoService,
    private agentTransactionService: AgentTransactionService
  ) {}

  // To store our subscriptions so we can clean them up on destroy
  private subscriptions: Subscription[] = [];
  
  // ViewChild references to the canvas elements
  @ViewChild('bitcoinChart') bitcoinChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ethereumChart') ethereumChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cardanoChart') cardanoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('solanaChart') solanaChartRef!: ElementRef<HTMLCanvasElement>;
  
  // Chart instances
  private bitcoinChart: Chart | null = null;
  private ethereumChart: Chart | null = null;
  private cardanoChart: Chart | null = null;
  private solanaChart: Chart | null = null;
  
  // Data arrays for charts
  private bitcoinPrices: number[] = [];
  private ethereumPrices: number[] = [];
  private cardanoPrices: number[] = [];
  private solanaPrices: number[] = [];
  
  // Time labels for x-axis
  private timeLabels: string[] = [];
  
  // Maximum data points to keep
  private readonly MAX_DATA_POINTS = 20;
  // Properties to store the current rates
  bitcoinPrice: number = 0;
  ethereumPrice: number = 0;
  cardanoPrice: number = 0;
  solanaPrice: number = 0;
  
  // Property to store last update time
  lastUpdated: Date = new Date();
  
  // Tab navigation
  activeTab: string = 'buy-sell';
  
  // Trade form properties
  tradeType: string = 'buy';
  selectedCrypto: string = 'BTC';
  tradeAmount: number = 0;
  estimatedQuantity: string = '0.00000000';
  selectedPaymentMethod: string = 'cash';
  
  
  
  ngAfterViewInit(): void {
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }
  
  ngOnInit(): void {
    this.loadTransactions();
    this.subscribeToRates();
    this.subscriptions.push(
      this.binanceConnection.getBitcoinRate().subscribe(rate => {
        this.bitcoinPrice = rate.price;
        this.lastUpdated = rate.lastUpdate;
        
        // Update chart data
        this.updateChartData(this.bitcoinPrices, rate.price, rate.lastUpdate);
        
        // Update chart if initialized
        if (this.bitcoinChart) {
          this.updateChart(this.bitcoinChart, this.bitcoinPrices);
        }
      })
    );
    
    // Subscribe to Ethereum rate updates
    this.subscriptions.push(
      this.binanceConnection.getEthereumRate().subscribe(rate => {
        this.ethereumPrice = rate.price;
        this.lastUpdated = rate.lastUpdate;
        
        // Update chart data
        this.updateChartData(this.ethereumPrices, rate.price, rate.lastUpdate);
        
        // Update chart if initialized
        if (this.ethereumChart) {
          this.updateChart(this.ethereumChart, this.ethereumPrices);
        }
      })
    );
    
    // Subscribe to Cardano rate updates
    this.subscriptions.push(
      this.binanceConnection.getCardanoRate().subscribe(rate => {
        this.cardanoPrice = rate.price;
        this.lastUpdated = rate.lastUpdate;
        
        // Update chart data
        this.updateChartData(this.cardanoPrices, rate.price, rate.lastUpdate);
        
        // Update chart if initialized
        if (this.cardanoChart) {
          this.updateChart(this.cardanoChart, this.cardanoPrices);
        }
      })
    );
    
    // Subscribe to Solana rate updates
    this.subscriptions.push(
      this.binanceConnection.getSolanaRate().subscribe(rate => {
        this.solanaPrice = rate.price;
        this.lastUpdated = rate.lastUpdate;
        
        // Update chart data
        this.updateChartData(this.solanaPrices, rate.price, rate.lastUpdate);
        
        // Update chart if initialized
        if (this.solanaChart) {
          this.updateChart(this.solanaChart, this.solanaPrices);
        }
      })
    );

    // Update time every second to show accurate time if no updates are coming
    this.subscriptions.push(
      interval(1000).subscribe(() => {
        // Only update if we haven't had a rate update in the last second
        const now = new Date();
        if (now.getTime() - this.lastUpdated.getTime() > 1000) {
          this.lastUpdated = now;
        }
      })
    );
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
    // Modal will now display with transaction details
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

  private initCharts(): void {
    if (this.bitcoinChartRef) {
      this.bitcoinChart = this.createChart(
        this.bitcoinChartRef.nativeElement, 
        this.bitcoinPrices, 
        'rgba(245, 158, 11, 0.2)', 
        'rgb(245, 158, 11)'
      );
    }
    
    if (this.ethereumChartRef) {
      this.ethereumChart = this.createChart(
        this.ethereumChartRef.nativeElement, 
        this.ethereumPrices, 
        'rgba(37, 99, 235, 0.2)', 
        'rgb(37, 99, 235)'
      );
    }
    
    if (this.cardanoChartRef) {
      this.cardanoChart = this.createChart(
        this.cardanoChartRef.nativeElement, 
        this.cardanoPrices, 
        'rgba(79, 70, 229, 0.2)', 
        'rgb(79, 70, 229)'
      );
    }
    
    if (this.solanaChartRef) {
      this.solanaChart = this.createChart(
        this.solanaChartRef.nativeElement, 
        this.solanaPrices, 
        'rgba(124, 58, 237, 0.2)', 
        'rgb(124, 58, 237)'
      );
    }
  }
  private createChart(
    canvas: HTMLCanvasElement, 
    data: number[], 
    backgroundColor: string, 
    borderColor: string
  ): Chart {
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.timeLabels,
        datasets: [{
          label: 'Price (USD)',
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return '$' + context.parsed.y.toFixed(2);
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        animation: {
          duration: 250
        }
      }
    });
  }
  
  // Update chart with new data
  private updateChart(chart: Chart, data: number[]): void {
    chart.data.labels = [...this.timeLabels];
    chart.data.datasets[0].data = [...data];
    chart.update('none'); // Update without animation for better performance
  }
  
  // Destroy all chart instances
  private destroyCharts(): void {
    if (this.bitcoinChart) {
      this.bitcoinChart.destroy();
      this.bitcoinChart = null;
    }
    
    if (this.ethereumChart) {
      this.ethereumChart.destroy();
      this.ethereumChart = null;
    }
    
    if (this.cardanoChart) {
      this.cardanoChart.destroy();
      this.cardanoChart = null;
    }
    
    if (this.solanaChart) {
      this.solanaChart.destroy();
      this.solanaChart = null;
    }
  }

   private updateChartData(priceArray: number[], price: number, timestamp: Date): void {
    // Add price to array
    priceArray.push(price);
    
    // If this is the first data point, initialize the time labels
    if (this.timeLabels.length === 0 || priceArray.length === 1) {
      const timeLabel = this.formatTimeLabel(timestamp);
      this.timeLabels.push(timeLabel);
    }
    
    // Manage array size (keep only the most recent MAX_DATA_POINTS values)
    if (priceArray.length > this.MAX_DATA_POINTS) {
      priceArray.shift();
    }
    
    // Handle time labels (update the last one or add a new one)
    const latestTimeLabel = this.formatTimeLabel(timestamp);
    if (this.timeLabels.length > 0) {
      this.timeLabels[this.timeLabels.length - 1] = latestTimeLabel;
    }
    
    // Keep the same number of labels as data points
    while (this.timeLabels.length > this.MAX_DATA_POINTS) {
      this.timeLabels.shift();
    }
  }
  private formatTimeLabel(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}
