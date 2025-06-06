import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CryptoService, CryptoTransaction } from '../../crypto.service';
import { BinanceCommunicationService } from '../../services/binance-communication.service';

@Component({
  selector: 'app-crypto-transaction-modal',
  templateUrl: './crypto-transaction-modal.component.html',
  styleUrls: ['./crypto-transaction-modal.component.css'],
  standalone: false
})
export class CryptoTransactionModalComponent implements OnInit {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();
  @Output() transactionComplete = new EventEmitter<CryptoTransaction>();

  // Form model
  tradeType: 'buy' | 'sell' = 'buy';
  selectedCrypto = 'BTC';
  tradeAmount = 0;
  estimatedQuantity = '0.00000000';
  selectedPaymentMethod = 'Cash Balance';
  cashBalance = 15420.75; // This would come from a user account service in a real app

  // Crypto rates
  currentRates: Record<string, number> = {};

  constructor(
    private cryptoService: CryptoService,
    private binanceService: BinanceCommunicationService
  ) {}

  ngOnInit(): void {
    this.subscribeToRates();
  }

  subscribeToRates(): void {
    // Subscribe to bitcoin rate
    this.binanceService.getBitcoinRate().subscribe(rate => {
      this.currentRates['BTC'] = rate.price;
      this.updateEstimatedQuantity();
    });
    
    // Subscribe to ethereum rate
    this.binanceService.getEthereumRate().subscribe(rate => {
      this.currentRates['ETH'] = rate.price;
      this.updateEstimatedQuantity();
    });
    
    // Subscribe to cardano rate
    this.binanceService.getCardanoRate().subscribe(rate => {
      this.currentRates['ADA'] = rate.price;
      this.updateEstimatedQuantity();
    });
    
    // Subscribe to solana rate
    this.binanceService.getSolanaRate().subscribe(rate => {
      this.currentRates['SOL'] = rate.price;
      this.updateEstimatedQuantity();
    });
  }

  closeModal(): void {
    this.isVisible = false;
    this.close.emit();
  }

  setTradeType(type: 'buy' | 'sell'): void {
    this.tradeType = type;
    this.updateEstimatedQuantity();
  }

  updateEstimatedQuantity(): void {
    if (!this.tradeAmount || this.tradeAmount <= 0) {
      this.estimatedQuantity = '0.00000000';
      return;
    }
    
    const currentPrice = this.currentRates[this.selectedCrypto];
    
    if (currentPrice > 0) {
      const quantity = this.tradeAmount / currentPrice;
      // Format with 8 decimal places for crypto
      this.estimatedQuantity = quantity.toFixed(8);
    } else {
      this.estimatedQuantity = '0.00000000';
    }
  }

  getCryptoName(symbol: string): string {
    switch (symbol) {
      case 'BTC': return 'Bitcoin';
      case 'ETH': return 'Ethereum';
      case 'ADA': return 'Cardano';
      case 'SOL': return 'Solana';
      default: return symbol;
    }
  }

  submitTransaction(): void {
    // Generate a unique ID
    const newId = 'ct' + Math.floor(1007 + Math.random() * 1000);
    
    // Calculate price based on current rates
    const price = this.currentRates[this.selectedCrypto];
    
    // Convert estimatedQuantity from string to number
    const amount = parseFloat(this.estimatedQuantity);
    
    // Calculate total (plus a small fee in a real system)
    const total = this.tradeAmount;
    
    // Create transaction object
    const transaction: CryptoTransaction = {
      id: newId,
      type: this.tradeType,
      symbol: this.selectedCrypto,
      amount: amount,
      price: price,
      total: total,
      status: 'pending',
      timestamp: new Date(),
      fee: total * 0.0025 // 0.25% fee
    };

    // Add the transaction using the service
    this.cryptoService.addCryptoTransaction(transaction).subscribe({
      next: (result) => {
        this.transactionComplete.emit(result);
        this.closeModal();
        
        // Reset form values
        this.tradeAmount = 0;
        this.updateEstimatedQuantity();
      },
      error: (error) => {
        console.error('Error adding transaction:', error);
        // In a real app, you would display an error message to the user
      }
    });
  }
}