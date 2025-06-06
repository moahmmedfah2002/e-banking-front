import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Compte } from './modele/Compte';
import { 
  MOCK_ACCOUNTS, 
  MOCK_CHECKING_ACCOUNTS, 
  MOCK_SAVINGS_ACCOUNTS, 
  MOCK_INVESTMENT_ACCOUNTS,
  USER_ACCOUNTS,
  ACCOUNT_TYPES
} from './modele/mock-accounts';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.apiUrl ? `${environment.apiUrl}/accounts` : '/api/accounts';
  private userAccounts = USER_ACCOUNTS;

  constructor(private http: HttpClient) { }

  /**
   * Get all accounts for the current user
   * @returns Observable of all user accounts
   */
  getAccounts(): Observable<Compte[]> {
    // In production, would use API call like:
    // return this.http.get<Compte[]>(this.apiUrl)...

    // For development, using mock data
    return of(MOCK_ACCOUNTS.filter(account => 
      this.userAccounts.includes(account.numericCompte || '')
    )).pipe(
      tap(_ => console.log('Fetched accounts')),
      catchError(this.handleError<Compte[]>('getAccounts', []))
    );
  }

  /**
   * Get accounts by type (Checking, Savings, Investment)
   * @param type Account type
   * @returns Observable of accounts of the specified type
   */
  getAccountsByType(type: string): Observable<Compte[]> {
    // In production, would use API call like:
    // return this.http.get<Compte[]>(`${this.apiUrl}?type=${type}`)...

    // For development, using mock data
    let accounts: Compte[] = [];
    
    switch (type.toLowerCase()) {
      case 'checking':
        accounts = MOCK_CHECKING_ACCOUNTS;
        break;
      case 'savings':
        accounts = MOCK_SAVINGS_ACCOUNTS;
        break;
      case 'investment':
        accounts = MOCK_INVESTMENT_ACCOUNTS;
        break;
      default:
        accounts = MOCK_ACCOUNTS;
    }

    return of(accounts.filter(account => 
      this.userAccounts.includes(account.numericCompte || '')
    )).pipe(
      tap(accounts => console.log(`Fetched ${accounts.length} ${type} accounts`)),
      catchError(this.handleError<Compte[]>(`getAccountsByType type=${type}`, []))
    );
  }

  /**
   * Get a single account by account number
   * @param accountNumber Account number to fetch
   * @returns Observable of the account
   */
  getAccount(accountNumber: string): Observable<Compte | null> {
    // In production, would use API call like:
    // return this.http.get<Compte>(`${this.apiUrl}/${accountNumber}`)...

    // For development, using mock data
    const account = MOCK_ACCOUNTS.find(a => a.numericCompte === accountNumber);
    
    return of(account || null).pipe(
      tap(result => console.log(`Fetched account number=${accountNumber}, found=${!!result}`)),
      catchError(this.handleError<Compte | null>(`getAccount accountNumber=${accountNumber}`))
    );
  }

  /**
   * Create a new account
   * @param account Account object to create
   * @returns Observable of the created account
   */
  createAccount(account: Compte): Observable<Compte> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // In production, would use API call like:
    // return this.http.post<Compte>(this.apiUrl, account, httpOptions)...

    // For development, simulate account creation
    account.dateCreation = account.dateCreation || new Date();
    account.statue = true; // Default to active account
    account.transactions = []; // Initialize empty transactions
    
    return of(account).pipe(
      tap((newAccount: Compte) => console.log(`Created account w/ number=${newAccount.numericCompte}`)),
      catchError(this.handleError<Compte>('createAccount'))
    );
  }

  /**
   * Update an existing account
   * @param account Account object to update
   * @returns Observable of the updated account
   */
  updateAccount(account: Compte): Observable<Compte> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    // In production, would use API call like:
    // return this.http.put<Compte>(`${this.apiUrl}/${account.numericCompte}`, account, httpOptions)...

    // For development, simulate account update
    return of(account).pipe(
      tap(_ => console.log(`Updated account number=${account.numericCompte}`)),
      catchError(this.handleError<Compte>('updateAccount'))
    );
  }

  /**
   * Open a new account of the specified type
   * @param type Account type (Checking, Savings, Investment)
   * @param initialDeposit Initial deposit amount
   * @returns Observable of the new account
   */
  openAccount(type: string, initialDeposit: number): Observable<Compte> {
    if (!ACCOUNT_TYPES.includes(type)) {
      return throwError(() => new Error(`Invalid account type: ${type}`));
    }

    if (initialDeposit < 0) {
      return throwError(() => new Error('Initial deposit cannot be negative'));
    }

    const newAccount: Compte = {
      numericCompte: this.generateAccountNumber(),
      solde: initialDeposit,
      statue: true,
      dateCreation: new Date(),
      typeCompte: type,
      transactions: []
    };

    return this.createAccount(newAccount);
  }

  /**
   * Close an existing account
   * @param accountNumber Account number to close
   * @returns Observable of success status
   */
  closeAccount(accountNumber: string): Observable<boolean> {
    // In production, would use API call like:
    // return this.http.delete<any>(`${this.apiUrl}/${accountNumber}`)...

    // For development, simulate account closing
    return this.getAccount(accountNumber).pipe(
      map(account => {
        if (!account) {
          throw new Error('Account not found');
        }
        
        if ((account.solde || 0) > 0) {
          throw new Error('Cannot close account with remaining balance');
        }
        
        account.statue = false;
        return true;
      }),
      tap(_ => console.log(`Closed account number=${accountNumber}`)),
      catchError(this.handleError<boolean>('closeAccount', false))
    );
  }

  /**
   * Transfer money between accounts
   * @param fromAccountNumber Source account number
   * @param toAccountNumber Destination account number
   * @param amount Amount to transfer
   * @returns Observable of success status
   */
  transferMoney(fromAccountNumber: string, toAccountNumber: string, amount: number): Observable<boolean> {
    if (amount <= 0) {
      return throwError(() => new Error('Transfer amount must be greater than zero'));
    }

    // For development, simulate money transfer
    return of(true).pipe(
      tap(_ => console.log(`Transferred $${amount} from ${fromAccountNumber} to ${toAccountNumber}`)),
      catchError(this.handleError<boolean>('transferMoney', false))
    );
  }

  /**
   * Get available account types
   * @returns Array of available account types
   */
  getAccountTypes(): string[] {
    return ACCOUNT_TYPES;
  }

  /**
   * Get user account numbers
   * @returns Array of user account numbers
   */
  getUserAccountNumbers(): string[] {
    return this.userAccounts;
  }

  /**
   * Format account number for display (e.g., ****1234)
   * @param accountNumber Account number to format
   * @returns Formatted account number
   */
  formatAccountNumber(accountNumber: string | undefined): string {
    if (!accountNumber) return '';
    return `****${accountNumber.slice(-4)}`;
  }

  /**
   * Format account balance with currency symbol
   * @param balance Balance to format
   * @returns Formatted balance string
   */
  formatBalance(balance: number | undefined): string {
    if (balance === undefined) return '$0.00';
    return `$${balance.toFixed(2)}`;
  }

  /**
   * Generate a new random account number 
   * @returns Generated account number
   */
  private generateAccountNumber(): string {
    return Math.floor(Math.random() * 9000000000) + 1000000000 + '';
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
