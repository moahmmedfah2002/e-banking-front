import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define interfaces for our data structures
export interface CryptoTransaction {
  id: string;
  type: 'buy' | 'sell'; 
  symbol: string;
  amount: number; 
  price: number;
  total: number; 
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  fee?: number;
}

// Mock data
const MOCK_CRYPTO_TRANSACTIONS: CryptoTransaction[] = [
  {
    id: 'ct1001',
    type: 'buy',
    symbol: 'BTC',
    amount: 0.05,
    price: 42350.25,
    total: 2117.51,
    status: 'completed',
    timestamp: new Date('2025-05-25T10:30:00'),
    fee: 5.25
  },
  {
    id: 'ct1002',
    type: 'sell',
    symbol: 'ETH',
    amount: 1.2,
    price: 2275.50,
    total: 2730.60,
    status: 'completed',
    timestamp: new Date('2025-05-20T14:45:00'),
    fee: 6.82
  },
  {
    id: 'ct1003',
    type: 'buy',
    symbol: 'SOL',
    amount: 10,
    price: 105.75,
    total: 1057.50,
    status: 'completed',
    timestamp: new Date('2025-05-15T09:15:00'),
    fee: 2.64
  },
  {
    id: 'ct1004',
    type: 'buy',
    symbol: 'ETH',
    amount: 0.5,
    price: 2290.30,
    total: 1145.15,
    status: 'completed',
    timestamp: new Date('2025-05-10T11:20:00'),
    fee: 2.85
  },
  {
    id: 'ct1005',
    type: 'sell',
    symbol: 'BTC',
    amount: 0.02,
    price: 41980.75,
    total: 839.62,
    status: 'completed',
    timestamp: new Date('2025-05-05T16:30:00'),
    fee: 2.10
  },
  {
    id: 'ct1006',
    type: 'buy',
    symbol: 'ADA',
    amount: 500,
    price: 0.42,
    total: 210.00,
    status: 'pending',
    timestamp: new Date('2025-06-04T08:45:00'),
    fee: 0.52
  }
];

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  // Get all crypto transactions with optional filtering
  getCryptoTransactions(options?: {
    type?: 'buy' | 'sell',
    symbol?: string,
    status?: 'completed' | 'pending' | 'failed',
    fromDate?: Date,
    toDate?: Date
  }): Observable<CryptoTransaction[]> {
    // In a real app, this would call an API with the filters
    let filteredTransactions = [...MOCK_CRYPTO_TRANSACTIONS];
    
    if (options) {
      if (options.type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === options.type);
      }
      if (options.symbol) {
        filteredTransactions = filteredTransactions.filter(t => t.symbol === options.symbol);
      }
      if (options.status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === options.status);
      }      if (options.fromDate !== undefined) {
        filteredTransactions = filteredTransactions.filter(t => t.timestamp >= options.fromDate!);
      }
      if (options.toDate !== undefined) {
        filteredTransactions = filteredTransactions.filter(t => t.timestamp <= options.toDate!);
      }
    }
    
    // Sort by timestamp descending (newest first)
    filteredTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return of(filteredTransactions);
  }
  
  // Get transaction by ID
  getCryptoTransaction(id: string): Observable<CryptoTransaction | undefined> {
    const transaction = MOCK_CRYPTO_TRANSACTIONS.find(t => t.id === id);
    return of(transaction);
  }
  
  // Add a new crypto transaction
  addCryptoTransaction(transaction: CryptoTransaction): Observable<CryptoTransaction> {
    // In a real app, this would be an API call
    MOCK_CRYPTO_TRANSACTIONS.push(transaction);
    return of(transaction);
  }
  
  // Get transaction statistics
  getTransactionStats(): Observable<{
    totalBought: number;
    totalSold: number;
    netPosition: number;
    transactionCount: number;
  }> {
    const totalBought = MOCK_CRYPTO_TRANSACTIONS
      .filter(t => t.type === 'buy' && t.status === 'completed')
      .reduce((sum, t) => sum + t.total, 0);
      
    const totalSold = MOCK_CRYPTO_TRANSACTIONS
      .filter(t => t.type === 'sell' && t.status === 'completed')
      .reduce((sum, t) => sum + t.total, 0);
      
    const transactionCount = MOCK_CRYPTO_TRANSACTIONS.length;
    
    return of({
      totalBought,
      totalSold,
      netPosition: totalBought - totalSold,
      transactionCount
    });
  }
}
