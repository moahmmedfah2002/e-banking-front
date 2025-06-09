import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentAccountService {
  private origin = environment.apiUrl;
  private apiUrl = `${environment.apiUrl}/comptes`;

  constructor(private http: HttpClient) { }

  /**
   * Get all accounts managed by the agent
   * @param filters Optional filters to apply
   * @returns Observable with accounts data
   */
  getAllAccounts(filters?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params: filters });
  }

  /**
   * Get details for a specific account
   * @param accountId The ID of the account
   * @returns Observable with account details
   */
  getAccountDetails(accountId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${accountId}`);
  }

  /**
   * Get account transaction history
   * @param accountId The ID of the account
   * @param filters Optional filters (date range, transaction type, etc.)
   * @returns Observable with account transactions
   */
  getAccountTransactions(accountId: string, filters?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${accountId}/transactions`, { params: filters });
  }

  /**
   * Update account information
   * @param accountId The ID of the account to update
   * @param accountData The new account data
   * @returns Observable with the updated account
   */
  updateAccount(accountId: string, accountData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${accountId}`, accountData);
  }

  /**
   * Create a new account for a client
   * @param clientId The ID of the client
   * @param accountData The account details
   * @returns Observable with the created account
   */
  createAccount(clientId: string, accountData: any): Observable<any> {
    const data = {
      ...accountData,
      clientId
    };
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  /**
   * Get account balance history for analytics
   * @param accountId The ID of the account
   * @param period The time period (e.g., '7d', '30d', '90d', '1y')
   * @returns Observable with account balance history data
   */
  getAccountBalanceHistory(accountId: string, period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${accountId}/balance-history`, { params: { period } });
  }
}
