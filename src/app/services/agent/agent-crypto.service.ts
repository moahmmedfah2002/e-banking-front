import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentCryptoService {
  private apiUrl = `${environment.apiUrl}/agent/crypto`;

  constructor(private http: HttpClient) { }

  /**
   * Get current prices for all supported cryptocurrencies
   * @returns Observable with current market rates
   */
  getCurrentPrices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/prices`);
  }

  /**
   * Get historical price data for a specific cryptocurrency
   * @param symbol The cryptocurrency symbol (BTC, ETH, etc.)
   * @param period The time period to get data for (e.g., '24h', '7d', '30d', '1y')
   * @returns Observable with historical price data
   */
  getHistoricalPrices(symbol: string, period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${symbol}`, { params: { period } });
  }

  /**
   * Get statistics about cryptocurrencies (total transactions, active cryptos, etc.)
   * @returns Observable with crypto statistics
   */
  getCryptoStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }

  /**
   * Get the price for a specific cryptocurrency
   * @param symbol The cryptocurrency symbol (BTC, ETH, etc.)
   * @returns Observable with the current price
   */
  getCryptoPrice(symbol: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/price/${symbol}`);
  }

  /**
   * Execute a crypto transaction for a client
   * @param transactionData Details of the transaction
   * @returns Observable with the transaction result
   */
  executeCryptoTransaction(transactionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transaction`, transactionData);
  }
}
