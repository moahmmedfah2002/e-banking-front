// filepath: d:\projects\Frontend-always-brake\e-banking-front\src\app\services\transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Transaction } from '../modele/Transaction';
import { MOCK_TRANSACTIONS, USER_ACCOUNTS } from '../modele/mock-transactions';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = environment.apiUrl ? `${environment.apiUrl}/transactions` : '/api/transactions';
  private userAccounts = USER_ACCOUNTS;

  constructor(private http: HttpClient) { }

  // CRUD Operations

  /**
   * Get all transactions for a specific user account
   * @param accountNumber The account number to fetch transactions for
   * @returns Observable of Transaction array
   */
  getTransactions(accountNumber?: string): Observable<Transaction[]> {
    // In production, would use API call like:
    // return this.http.get<Transaction[]>(`${this.apiUrl}?accountNumber=${accountNumber}`)...

    // For development, using mock data
    return of(MOCK_TRANSACTIONS).pipe(
      map(transactions => {
        if (accountNumber) {
          return transactions.filter(t => 
            t.compteAdebit === accountNumber || t.compteAcredit === accountNumber
          );
        }
        return transactions;
      }),
      tap(_ => console.log('Fetched transactions')),
      catchError(this.handleError<Transaction[]>('getTransactions', []))
    );
  }
  /**
   * Get a single transaction by ID
   * @param id Transaction ID to fetch
   * @returns Observable of Transaction or null if not found
   */
  getTransaction(id: number): Observable<Transaction | null> {
    // In production, would use API call like:
    // return this.http.get<Transaction>(`${this.apiUrl}/${id}`)...

    // For development, using mock data
    const transaction = MOCK_TRANSACTIONS.find(t => t.id === id);
    
    return of(transaction || null).pipe(
      tap(result => console.log(`Fetched transaction id=${id}, found=${!!result}`)),
      catchError(this.handleError<Transaction | null>(`getTransaction id=${id}`))
    );
  }

  /**
   * Create a new transaction
   * @param transaction Transaction object to create
   * @returns Observable of created Transaction
   */
  createTransaction(transaction: Transaction): Observable<Transaction> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // In production, would use API call like:
    // return this.http.post<Transaction>(this.apiUrl, transaction, httpOptions)...

    // For development, simulate a new transaction
    return of({
      ...transaction,
      id: MOCK_TRANSACTIONS.length + 1,
      dateTransaction: transaction.dateTransaction || new Date()
    }).pipe(
      tap((newTransaction: Transaction) => console.log(`Created transaction w/ id=${newTransaction.id}`)),
      catchError(this.handleError<Transaction>('createTransaction'))
    );
  }

  /**
   * Make a transfer between accounts
   * @param fromAccount Source account number
   * @param toAccount Destination account number
   * @param amount Amount to transfer
   * @param note Optional note for the transaction
   * @returns Observable of created Transaction
   */
  makeTransfer(fromAccount: string, toAccount: string, amount: number, note?: string): Observable<Transaction> {
    if (amount <= 0) {
      return throwError(() => new Error('Amount must be greater than zero'));
    }

    const transaction: Transaction = {
      monet: amount,
      dateTransaction: new Date(),
      typeTransaction: 'Sortante',
      compteAdebit: fromAccount,
      compteAcredit: toAccount
    };

    return this.createTransaction(transaction);
  }

  /**
   * Pay a bill
   * @param fromAccount Source account number
   * @param payee Payee identifier
   * @param amount Amount to pay
   * @param accountNumber Payee account number
   * @param memo Optional memo for the transaction
   * @returns Observable of created Transaction
   */
  payBill(fromAccount: string, payee: string, amount: number, accountNumber: string, memo?: string): Observable<Transaction> {
    if (amount <= 0) {
      return throwError(() => new Error('Amount must be greater than zero'));
    }

    const transaction: Transaction = {
      monet: amount,
      dateTransaction: new Date(),
      typeTransaction: 'Sortante',
      compteAdebit: fromAccount,
      compteAcredit: accountNumber
    };

    return this.createTransaction(transaction);
  }

  /**
   * Deposit a check
   * @param toAccount Destination account number
   * @param amount Check amount
   * @param memo Optional memo for the transaction
   * @returns Observable of created Transaction
   */
  depositCheck(toAccount: string, amount: number, memo?: string): Observable<Transaction> {
    if (amount <= 0) {
      return throwError(() => new Error('Amount must be greater than zero'));
    }

    const transaction: Transaction = {
      monet: amount,
      dateTransaction: new Date(),
      typeTransaction: 'Entrante',
      compteAdebit: 'CHECK_DEPOSIT',
      compteAcredit: toAccount
    };

    return this.createTransaction(transaction);
  }

  /**
   * Get user account numbers
   * @returns Array of user account numbers
   */
  getUserAccounts(): string[] {
    return this.userAccounts;
  }

  /**
   * Check if an account belongs to the user
   * @param accountNumber Account number to check
   * @returns Boolean indicating if the account belongs to the user
   */
  isUserAccount(accountNumber: string | undefined): boolean {
    return accountNumber !== undefined && this.userAccounts.includes(accountNumber);
  }

  /**
   * Determine if a transaction is incoming to a user account
   * @param transaction Transaction to check
   * @returns Boolean indicating if it's an incoming transaction
   */
  isIncomingTransaction(transaction: Transaction): boolean {
    return transaction.compteAcredit !== undefined && 
           this.userAccounts.includes(transaction.compteAcredit);
  }

  /**
   * Format transaction amount with currency symbol and sign
   * @param amount Amount to format
   * @returns Formatted amount string
   */
  formatAmount(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return `${amount > 0 ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;
  }

  /**
   * Get appropriate CSS class for transaction amount
   * @param transaction Transaction to check
   * @returns CSS class for the amount
   */
  getAmountClass(transaction: Transaction): string {
    return this.isUserAccount(transaction.compteAdebit) ? 'text-red-600' : 'text-green-600';
  }

  /**
   * Handle HTTP operation that failed
   * @param operation Name of the operation that failed
   * @param result Optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}