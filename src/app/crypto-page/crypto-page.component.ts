import { Component, inject, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { BinanceCommunicationService } from '../services/binance-communication.service';
import { Subscription, interval } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';

// Register all Chart.js components
Chart.register(...registerables);

// Define interface for portfolio items
interface PortfolioItem {
  symbol: string;
  quantity: number;
  averageBuyPrice: number;
  profitLoss: number;
}

@Component({
  selector: 'app-crypto-page',
  standalone: false,
  templateUrl: './crypto-page.component.html',
  styleUrl: './crypto-page.component.css'
})
export class CryptoPageComponent implements OnInit, OnDestroy, AfterViewInit {
  binanceConnection = inject(BinanceCommunicationService);  
  
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
  
  // Portfolio data
  portfolio: PortfolioItem[] = [
    // Example portfolio items - in a real app, these would come from an API/service
    {
      symbol: 'BTC',
      quantity: 0.05,
      averageBuyPrice: 38000,
      profitLoss: 5.2
    },
    {
      symbol: 'ETH',
      quantity: 1.2,
      averageBuyPrice: 2200,
      profitLoss: -2.8
    }
  ];
  
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
  
  constructor() {}
  
  ngOnInit(): void {
    // Subscribe to Bitcoin rate updates
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
  
  ngAfterViewInit(): void {
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Destroy charts
    this.destroyCharts();
  }

  // Method to switch between tabs
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  // Method to set trade type (buy/sell)
  setTradeType(type: string): void {
    this.tradeType = type;
    this.updateEstimatedQuantity();
  }
  
  // Calculate estimated quantity based on current prices
  updateEstimatedQuantity(): void {
    if (!this.tradeAmount || this.tradeAmount <= 0) {
      this.estimatedQuantity = '0.00000000';
      return;
    }
    
    let currentPrice = 0;
    
    switch (this.selectedCrypto) {
      case 'BTC':
        currentPrice = this.bitcoinPrice;
        break;
      case 'ETH':
        currentPrice = this.ethereumPrice;
        break;
      case 'ADA':
        currentPrice = this.cardanoPrice;
        break;
      case 'SOL':
        currentPrice = this.solanaPrice;
        break;
      default:
        currentPrice = 0;
    }
    
    if (currentPrice > 0) {
      const quantity = this.tradeAmount / currentPrice;
      // Format with 8 decimal places for crypto
      this.estimatedQuantity = quantity.toFixed(8);
    } else {
      this.estimatedQuantity = '0.00000000';
    }
  }
  
  // Submit trade form
  submitTradeForm(): void {
    // This would connect to a backend service in a real app
    console.log(`${this.tradeType.toUpperCase()} order submitted`);
    console.log(`Crypto: ${this.selectedCrypto}`);
    console.log(`Amount: $${this.tradeAmount}`);
    console.log(`Estimated Quantity: ${this.estimatedQuantity} ${this.selectedCrypto}`);
    console.log(`Payment Method: ${this.selectedPaymentMethod}`);
    
    // Show a success message or update portfolio in a real implementation
    alert(`${this.tradeType === 'buy' ? 'Buy' : 'Sell'} order for ${this.estimatedQuantity} ${this.selectedCrypto} placed successfully!`);
    
    // Reset form
    this.tradeAmount = 0;
    this.updateEstimatedQuantity();
  }
  
  // Get full name of cryptocurrency from symbol
  getCryptoName(symbol: string): string {
    switch (symbol) {
      case 'BTC': return 'Bitcoin';
      case 'ETH': return 'Ethereum';
      case 'ADA': return 'Cardano';
      case 'SOL': return 'Solana';
      default: return symbol;
    }
  }
  
  // Get current price of a cryptocurrency
  getCryptoPrice(symbol: string): number {
    switch (symbol) {
      case 'BTC': return this.bitcoinPrice;
      case 'ETH': return this.ethereumPrice;
      case 'ADA': return this.cardanoPrice;
      case 'SOL': return this.solanaPrice;
      default: return 0;
    }
  }
  
  // Method to format date for display
  formatDate(date: Date): string {
    return date.toLocaleTimeString();
  }
  
  // Update chart data arrays with new price info
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
  
  // Format timestamp for display on chart
  private formatTimeLabel(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  
  // Initialize all charts
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
  
  // Create a new chart instance
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
}
