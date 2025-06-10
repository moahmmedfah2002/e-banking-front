import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth.service';
import { BinanceCommunicationService } from '../../binance-communication.service';
import { CryptoRate } from '../../../modele/CryptoRate';
import { CryptoTransaction } from '../../../modele/CryptoTransaction';

@Injectable({
  providedIn: 'root'
})
export class AgentCryptoService {
  private apiUrl = environment.apiUrl ? `${environment.apiUrl}/agents/crypto` : '/api/agents/crypto';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private binanceService: BinanceCommunicationService
  ) { }

  /**
   * Get current rates for supported cryptocurrencies
   * @returns Observable of CryptoRate array
   */
  getCurrentCryptoRates(): Observable<{[key: string]: CryptoRate}> {
    // We'll use the existing binance service to get real-time rates
    return new Observable(observer => {
      const rates: {[key: string]: CryptoRate} = {};
      
      // Subscribe to all rates and combine them
      const btcSub = this.binanceService.getBitcoinRate().subscribe(
        rate => {
          rates['BTC'] = rate;
          checkComplete();
        }
      );
      
      const ethSub = this.binanceService.getEthereumRate().subscribe(
        rate => {
          rates['ETH'] = rate;
          checkComplete();
        }
      );
      
      const adaSub = this.binanceService.getCardanoRate().subscribe(
        rate => {
          rates['ADA'] = rate;
          checkComplete();
        }
      );
      
      const solSub = this.binanceService.getSolanaRate().subscribe(
        rate => {
          rates['SOL'] = rate;
          checkComplete();
        }
      );
      
      // Helper to check if we have all the rates
      function checkComplete() {
        if (rates['BTC'] && rates['ETH'] && rates['ADA'] && rates['SOL']) {
          observer.next(rates);
          observer.complete();
          
          // Clean up subscriptions
          btcSub.unsubscribe();
          ethSub.unsubscribe();
          adaSub.unsubscribe();
          solSub.unsubscribe();
        }
      }
      
      // Return cleanup function
      return () => {
        btcSub.unsubscribe();
        ethSub.unsubscribe();
        adaSub.unsubscribe();
        solSub.unsubscribe();
      };
    });
  }

  /**
   * Get crypto transactions for clients managed by this agent
   * @param options Filter options
   * @returns Observable of CryptoTransaction array
   */
  getCryptoTransactions(options?: {
    clientId?: number,
    cryptoType?: string,
    fromDate?: Date,
    toDate?: Date
  }): Observable<CryptoTransaction[]> {
    const token = this.authService.getToken();
    let params = new HttpParams();
    
    if (options) {
      if (options.clientId) {
        params = params.set('clientId', options.clientId.toString());
      }
      if (options.cryptoType) {
        params = params.set('cryptoType', options.cryptoType);
      }
      if (options.fromDate) {
        params = params.set('fromDate', options.fromDate.toISOString());
      }
      if (options.toDate) {
        params = params.set('toDate', options.toDate.toISOString());
      }
    }
    
    return this.http.get<CryptoTransaction[]>(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    }).pipe(
      tap(transactions => console.log(`Fetched ${transactions.length} crypto transactions`)),
      catchError(this.handleError<CryptoTransaction[]>('getCryptoTransactions', []))
    );
  }

  /**
   * Get a single crypto transaction by ID
   * @param id Transaction ID
   * @returns Observable of CryptoTransaction
   */
  getCryptoTransaction(id: number): Observable<CryptoTransaction> {
    const token = this.authService.getToken();
    return this.http.get<CryptoTransaction>(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Fetched crypto transaction id=${id}`)),
      catchError(this.handleError<CryptoTransaction>(`getCryptoTransaction id=${id}`))
    );
  }

  /**
   * Create a new crypto transaction
   * @param transaction CryptoTransaction data
   * @returns Observable of created CryptoTransaction
   */
  createCryptoTransaction(transaction: CryptoTransaction): Observable<CryptoTransaction> {
    const token = this.authService.getToken();
    return this.http.post<CryptoTransaction>(this.apiUrl, transaction, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap((newTransaction: CryptoTransaction) => console.log(`Created crypto transaction w/ id=${newTransaction.id}`)),
      catchError(this.handleError<CryptoTransaction>('createCryptoTransaction'))
    );
  }

  /**
   * Get crypto statistics for agent dashboard
   * @returns Observable with crypto stats
   */
  getCryptoStats(): Observable<{
    totalTransactions: number;
    transactionVolumeBTC: number;
    transactionVolumeETH: number;
    transactionVolumeADA: number;
    transactionVolumeSOL: number;
  }> {
    const token = this.authService.getToken();
    return this.http.get<any>(`${this.apiUrl}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(stats => console.log('Fetched crypto statistics')),
      catchError(this.handleError<any>('getCryptoStats', {}))
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
