import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Compte } from '../../../modele/Compte';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AgentAccountService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get all accounts managed by this agent
   * @returns Observable of Compte array
   */
  getAccounts(agentId:number): Observable<Compte[]> {
    const token = this.authService.getToken();
    return this.http.get<Compte[]>(`${this.apiUrl}/comptes/agent/${agentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(accounts => console.log(`Fetched ${accounts.length} accounts`)),
      catchError(this.handleError<Compte[]>('getAccounts', []))
    );
  }

  /**
   * Get accounts for a specific client
   * @param clientId The client ID
   * @returns Observable of Compte array
   */
  getClientAccounts(clientId: number): Observable<Compte[]> {
    const token = this.authService.getToken();
    return this.http.get<Compte[]>(`${this.apiUrl}/client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(accounts => console.log(`Fetched ${accounts.length} accounts for client ${clientId}`)),
      catchError(this.handleError<Compte[]>(`getClientAccounts clientId=${clientId}`, []))
    );
  }

  /**
   * Get a single account by ID
   * @param id Account ID
   * @returns Observable of Compte
   */
  getAccount(id: number): Observable<Compte> {
    const token = this.authService.getToken();
    return this.http.get<Compte>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Fetched account id=${id}`)),
      catchError(this.handleError<Compte>(`getAccount id=${id}`))
    );
  }

  /**
   * Create a new account
   * @param account Account data to create
   * @returns Observable of created Compte
   */
  createAccount(account: Compte): Observable<Compte> {
    const token = this.authService.getToken();
    return this.http.post<Compte>(this.apiUrl, account, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap((newAccount: Compte) => console.log(`Created account w/ id=${newAccount.numericCompte}`)),
      catchError(this.handleError<Compte>('createAccount'))
    );
  }

  updateAccountToClient(accountId: string, accountData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${accountId}`, accountData);
  }

  /**
   * Create a new account for a client
   * @param clientId The ID of the client
   * @param accountData The account details
   * @returns Observable with the created account
   */
  createAccountToClient(clientId: number, accountData: Compte): Observable<Compte> {
    
    return this.http.post(`${this.apiUrl}/comptes/assign/${clientId}/compte`, accountData);
  }

  /**
   * Update an existing account
   * @param account Account data to update
   * @returns Observable of updated Compte
   */
  updateAccount(account: Compte): Observable<Compte> {
    const token = this.authService.getToken();
    return this.http.put<Compte>(`${this.apiUrl}/${account.numericCompte}`, account, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Updated account id=${account.numericCompte}`)),
      catchError(this.handleError<Compte>('updateAccount'))
    );
  }

  /**
   * Change account status (activate/deactivate)
   * @param id Account ID
   * @param isActive The new status
   * @returns Observable of updated Compte
   */
  changeAccountStatus(id: number, isActive: boolean): Observable<Compte> {
    const token = this.authService.getToken();
    return this.http.put<Compte>(`${this.apiUrl}/comptes/${id}/statut`, { isActive }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Changed account id=${id} status to ${isActive ? 'active' : 'inactive'}`)),
      catchError(this.handleError<Compte>('changeAccountStatus'))
    );
  }

  /**
   * Delete an account
   * @param accountNumber The account number to delete
   * @returns Observable of void
   */
    deleteAccount(accountNumber: number): Observable<void> {
    const token = this.authService.getToken();
    return this.http.delete<void>(`${this.apiUrl}/comptes/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Deleted account=${accountNumber}`)),
      catchError(this.handleError<void>('deleteAccount'))
    );
  }

  /**
   * Get account statistics for agent dashboard
   * @returns Observable with account stats
   */
  getAccountStats(): Observable<{
    totalAccounts: number;
    activeAccounts: number;
    inactiveAccounts: number;
    totalBalance: number;
  }> {
    const token = this.authService.getToken();
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(stats => console.log('Fetched account statistics')),
      catchError(this.handleError<any>('getAccountStats', {}))
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
