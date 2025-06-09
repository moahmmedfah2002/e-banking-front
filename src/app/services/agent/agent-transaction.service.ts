import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentTransactionService {
  private apiUrl = `${environment.apiUrl}/agent/transactions`;

  constructor(private http: HttpClient) { }

  /**
   * Get all transactions accessible to the agent
   * @param filters Optional filters to apply (status, type, symbol, etc.)
   * @returns Observable with transactions data
   */
  getAllTransactions(filters?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params: filters });
  }

  /**
   * Get transactions for a specific client
   * @param clientId The ID of the client
   * @param filters Optional filters to apply (status, type, symbol, etc.)
   * @returns Observable with client's transactions
   */
  getClientTransactions(clientId: string, filters?: any): Observable<any> {
    const params = { ...filters, clientId };
    return this.http.get(`${this.apiUrl}/client`, { params });
  }

  /**
   * Get details for a specific transaction
   * @param transactionId The ID of the transaction
   * @returns Observable with transaction details
   */
  getTransactionDetails(transactionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${transactionId}`);
  }

  /**
   * Update the status of a transaction (e.g., approve, reject, mark as complete)
   * @param transactionId The ID of the transaction to update
   * @param status The new status
   * @param notes Optional notes about the status update
   * @returns Observable with the updated transaction
   */
  updateTransactionStatus(transactionId: string, status: string, notes?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${transactionId}/status`, { status, notes });
  }
  
  /**
   * Create a new transaction for a client
   * @param transactionData The transaction details
   * @returns Observable with the created transaction
   */
  createTransaction(transactionData: any): Observable<any> {
    return this.http.post(this.apiUrl, transactionData);
  }
}
