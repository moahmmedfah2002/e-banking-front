import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentClientService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  /**
   * Get all clients assigned to the agent
   * @param filters Optional filters to apply (status, name, etc.)
   * @returns Observable with client data
   */
  getClients(filters?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/agent/clients`);
  }

  /**
   * Get detailed information about a specific client
   * @param clientId The ID of the client
   * @returns Observable with client details
   */
  getClientDetails(clientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/agent/clients/${clientId}`);
  }

  /**
   * Get a summary of client accounts
   * @param clientId The ID of the client
   * @returns Observable with client account summaries
   */
  getClientAccounts(clientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/agent/clients/${clientId}/accounts`);
  }

  /**
   * Update client information
   * @param clientId The ID of the client to update
   * @param clientData The new client data
   * @returns Observable with the updated client
   */
  updateClient(clientId: string, clientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/agent/clients/${clientId}`, clientData);
  }

  /**
   * Add a new client for the agent
   * @param clientData The new client data
   * @returns Observable with the created client
   */
  addClient(clientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agent/clients`, clientData);
  }

  /**
   * Get client crypto portfolio summary
   * @param clientId The ID of the client
   * @returns Observable with crypto portfolio data
   */
  getClientCryptoPortfolio(clientId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/agent/clients/${clientId}/crypto-portfolio`);
  }
}
