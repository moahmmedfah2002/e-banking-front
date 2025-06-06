import { Injectable } from '@angular/core';
import { Transaction } from './modele/Transaction';
import { MOCK_TRANSACTIONS } from './modele/mock-transactions';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  
  constructor() { }

  // Get all transactions with optional filtering
  getTransactions(options?: {
    type?: string,
    status?: string,
    fromDate?: Date,
    toDate?: Date,
    searchQuery?: string
  }): Observable<Transaction[]> {
    // In a real app, this would call an API with the filters
    let filteredTransactions = [...MOCK_TRANSACTIONS];
    
    if (options) {
      if (options.type && options.type !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.typeTransaction === options.type);
      }
      
      // Filter by date range if provided
      if (options.fromDate) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.dateTransaction && t.dateTransaction >= options.fromDate!);
      }
      
      if (options.toDate) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.dateTransaction && t.dateTransaction <= options.toDate!);
      }
      
      // Filter by search query
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        filteredTransactions = filteredTransactions.filter(t => 
          t.id?.toString().includes(query) || 
          t.compteAdebit?.toLowerCase().includes(query) ||
          t.compteAcredit?.toLowerCase().includes(query));
      }
    }
    
    // Sort by date descending (newest first)
    filteredTransactions.sort((a, b) => {
      const dateA = a.dateTransaction ? a.dateTransaction.getTime() : 0;
      const dateB = b.dateTransaction ? b.dateTransaction.getTime() : 0;
      return dateB - dateA;
    });
    
    return of(filteredTransactions);
  }
  
  // Get transaction by ID
  getTransaction(id: number): Observable<Transaction | undefined> {
    return of(MOCK_TRANSACTIONS.find(transaction => transaction.id === id));
  }
    // Get transaction statistics
  getTransactionStats(): Observable<{
    totalTransactions: number;
    totalIncoming: number;
    totalOutgoing: number;
  }> {
    const totalIncoming = MOCK_TRANSACTIONS
      .filter(t => t.typeTransaction === 'Entrante')
      .reduce((sum, t) => sum + (t.monet || 0), 0);
      
    const totalOutgoing = MOCK_TRANSACTIONS
      .filter(t => t.typeTransaction === 'Sortante')
      .reduce((sum, t) => sum + (t.monet || 0), 0);
      
    const totalTransactions = MOCK_TRANSACTIONS.length;
    
    return of({
      totalTransactions,
      totalIncoming,
      totalOutgoing
    });
  }

  // Create a new transaction
  createTransaction(transaction: Transaction): Observable<Transaction> {
    // In a real app, this would call an API to save the transaction
    // For now, we'll just add it to our mock data
    const newId = Math.max(...MOCK_TRANSACTIONS.map(t => t.id || 0)) + 1;
    const newTransaction: Transaction = {
      ...transaction,
      id: newId,
      dateTransaction: new Date()
    };
    
    MOCK_TRANSACTIONS.unshift(newTransaction);
    
    return of(newTransaction);
  }

  // Get paginated transactions
  getPaginatedTransactions(options?: {
    type?: string,
    status?: string,
    searchQuery?: string,
    page: number,
    pageSize: number
  }): Observable<{
    transactions: Transaction[],
    total: number
  }> {
    // First get filtered transactions
    let filteredTransactions = [...MOCK_TRANSACTIONS];
    
    if (options) {
      if (options.type && options.type !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.typeTransaction === options.type);
      }
      
      // Filter by search query
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        filteredTransactions = filteredTransactions.filter(t => 
          t.id?.toString().includes(query) || 
          t.compteAdebit?.toLowerCase().includes(query) ||
          t.compteAcredit?.toLowerCase().includes(query));
      }
    }
    
    // Sort by date descending (newest first)
    filteredTransactions.sort((a, b) => {
      const dateA = a.dateTransaction ? a.dateTransaction.getTime() : 0;
      const dateB = b.dateTransaction ? b.dateTransaction.getTime() : 0;
      return dateB - dateA;
    });
    
    // Get total count before pagination
    const total = filteredTransactions.length;
    
    // Apply pagination
    if (options) {
      const startIndex = (options.page - 1) * options.pageSize;
      filteredTransactions = filteredTransactions.slice(
        startIndex,
        startIndex + options.pageSize
      );
    }
    
    return of({
      transactions: filteredTransactions,
      total
    });
  }
}
