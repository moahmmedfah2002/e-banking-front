import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Transaction } from '../../../modele/Transaction';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AgentTransactionService {
  private apiUrl = environment.apiUrl ? `${environment.apiUrl}/agents/transactions` : '/api/agents/transactions';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get all transactions managed by this agent
   * @param options Filter options
   * @returns Observable of Transaction array
   */
  getTransactions(options?: {
    type?: string,
    status?: string,
    fromDate?: Date,
    toDate?: Date,
    searchQuery?: string
  }): Observable<Transaction[]> {
    const token = this.authService.getToken();
    let params = new HttpParams();
    
    if (options) {
      if (options.type && options.type !== 'all') {
        params = params.set('type', options.type);
      }
      if (options.status && options.status !== 'all') {
        params = params.set('status', options.status);
      }
      if (options.fromDate) {
        params = params.set('fromDate', options.fromDate.toISOString());
      }
      if (options.toDate) {
        params = params.set('toDate', options.toDate.toISOString());
      }
      if (options.searchQuery) {
        params = params.set('search', options.searchQuery);
      }
    }
    
    return this.http.get<Transaction[]>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    }).pipe(
      tap(transactions => console.log(`Fetched ${transactions.length} transactions`)),
      catchError(this.handleError<Transaction[]>('getTransactions', []))
    );
  }

  /**
   * Get transactions for a specific client
   * @param clientId The client ID
   * @param options Filter options
   * @returns Observable of Transaction array
   */
  getClientTransactions(clientId: number, options?: {
    type?: string,
    fromDate?: Date,
    toDate?: Date
  }): Observable<Transaction[]> {
    const token = this.authService.getToken();
    let params = new HttpParams().set('clientId', clientId.toString());
    
    if (options) {
      if (options.type && options.type !== 'all') {
        params = params.set('type', options.type);
      }
      if (options.fromDate) {
        params = params.set('fromDate', options.fromDate.toISOString());
      }
      if (options.toDate) {
        params = params.set('toDate', options.toDate.toISOString());
      }
    }
    
    return this.http.get<Transaction[]>(`${this.apiUrl}/client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    }).pipe(
      tap(transactions => console.log(`Fetched ${transactions.length} transactions for client ${clientId}`)),
      catchError(this.handleError<Transaction[]>(`getClientTransactions clientId=${clientId}`, []))
    );
  }

  /**
   * Get transactions for a specific account
   * @param accountNumber The account number
   * @param options Filter options
   * @returns Observable of Transaction array
   */
  getAccountTransactions(accountNumber: string, options?: {
    type?: string,
    fromDate?: Date,
    toDate?: Date
  }): Observable<Transaction[]> {
    const token = this.authService.getToken();
    let params = new HttpParams();
    
    if (options) {
      if (options.type && options.type !== 'all') {
        params = params.set('type', options.type);
      }
      if (options.fromDate) {
        params = params.set('fromDate', options.fromDate.toISOString());
      }
      if (options.toDate) {
        params = params.set('toDate', options.toDate.toISOString());
      }
    }
    
    return this.http.get<Transaction[]>(`${this.apiUrl}/account/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    }).pipe(
      tap(transactions => console.log(`Fetched ${transactions.length} transactions for account ${accountNumber}`)),
      catchError(this.handleError<Transaction[]>(`getAccountTransactions accountNumber=${accountNumber}`, []))
    );
  }

  /**
   * Get a single transaction by ID
   * @param id Transaction ID
   * @returns Observable of Transaction
   */
  getTransaction(id: number): Observable<Transaction> {
    const token = this.authService.getToken();
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Fetched transaction id=${id}`)),
      catchError(this.handleError<Transaction>(`getTransaction id=${id}`))
    );
  }

  /**
   * Create a new transaction
   * @param transaction Transaction data
   * @returns Observable of created Transaction
   */
  createTransaction(transaction: Transaction): Observable<Transaction> {
    const token = this.authService.getToken();
    return this.http.post<Transaction>(this.apiUrl, transaction, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
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
   * @param note Optional note
   * @returns Observable of created Transaction
   */
  makeTransfer(fromAccount: string, toAccount: string, amount: number, note?: string): Observable<Transaction> {
    const token = this.authService.getToken();
    const transferData = {
      fromAccount,
      toAccount,
      amount,
      note
    };
    
    return this.http.post<Transaction>(`${this.apiUrl}/transfer`, transferData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap((newTransaction: Transaction) => console.log(`Created transfer transaction w/ id=${newTransaction.id}`)),
      catchError(this.handleError<Transaction>('makeTransfer'))
    );
  }

  /**
   * Get transaction statistics
   * @returns Observable with transaction stats
   */
  getTransactionStats(): Observable<{
    totalTransactions: number;
    totalIncoming: number;
    totalOutgoing: number;
    averageAmount: number;
  }> {
    const token = this.authService.getToken();
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(stats => console.log('Fetched transaction statistics')),
      catchError(this.handleError<any>('getTransactionStats', {}))
    );
  }

  /**
   * Get paginated transactions
   * @param options Pagination and filter options
   * @returns Observable with transactions and total count
   */
  getPaginatedTransactions(options: {
    page: number,
    pageSize: number,
    type?: string,
    status?: string,
    searchQuery?: string
  }): Observable<{
    transactions: Transaction[],
    total: number
  }> {
    const token = this.authService.getToken();
    let params = new HttpParams()
      .set('page', options.page.toString())
      .set('pageSize', options.pageSize.toString());
    
    if (options.type && options.type !== 'all') {
      params = params.set('type', options.type);
    }
    if (options.status && options.status !== 'all') {
      params = params.set('status', options.status);
    }
    if (options.searchQuery) {
      params = params.set('search', options.searchQuery);
    }
    
    return this.http.get<{transactions: Transaction[], total: number}>(`${this.apiUrl}/paginated`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    }).pipe(
      tap(result => console.log(`Fetched paginated transactions: ${result.transactions.length} of ${result.total}`)),
      catchError(this.handleError<{transactions: Transaction[], total: number}>('getPaginatedTransactions', {transactions: [], total: 0}))
    );
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
      return new Observable<T>(observer => {
        observer.next(result as T);
        observer.complete();
      });
    };
  }
}
