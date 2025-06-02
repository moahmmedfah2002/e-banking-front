import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, interval, of } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

// Interfaces for Binance data structures
export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  trades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignored: string;
}

export interface BinanceDepth {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface BinanceWebsocketMessage {
  stream: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class BinanceCommunicationService {
  private apiUrl = 'https://api.binance.com/api';
  private wsUrl = 'wss://stream.binance.com:9443/ws';
  private combineWsUrl = 'wss://stream.binance.com:9443/stream?streams=';
  
  private apiKey = ''; // Add your API key here
  private secretKey = ''; // Add your secret key here
  
  private socket: WebSocket | null = null;
  private socketSubject = new Subject<any>();
  private destroy$ = new Subject<void>();
  
  // Stream subjects for different data types
  private tickerSubject = new BehaviorSubject<BinanceTicker | null>(null);
  private klineSubject = new BehaviorSubject<BinanceKline | null>(null);
  private depthSubject = new BehaviorSubject<BinanceDepth | null>(null);
  
  // Public observables for components to subscribe to
  public ticker$ = this.tickerSubject.asObservable();
  public kline$ = this.klineSubject.asObservable();
  public depth$ = this.depthSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Initialize WebSocket connection to Binance API
   * @param streams Array of stream names to subscribe to
   */
  public connectWebSocket(streams: string[]): void {
    if (this.socket) {
      this.socket.close();
    }

    const url = streams.length > 1 
      ? `${this.combineWsUrl}${streams.join('/')}` 
      : `${this.wsUrl}/${streams[0]}`;
    
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.socketSubject.next(message);
        this.handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (streams.length > 0) {
          this.connectWebSocket(streams);
        }
      }, 5000);
    };

    // Setup ping to keep connection alive
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ method: 'PING' }));
        }
      });
  }

  /**
   * Close WebSocket connection
   */
  public closeWebSocket(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.destroy$.next();
  }

  /**
   * Subscribe to symbol ticker updates
   * @param symbol Trading pair symbol (e.g., 'btcusdt')
   */
  public subscribeToTicker(symbol: string): void {
    const streamName = `${symbol.toLowerCase()}@ticker`;
    this.connectWebSocket([streamName]);
  }

  /**
   * Subscribe to candlestick/kline updates
   * @param symbol Trading pair symbol (e.g., 'btcusdt')
   * @param interval Kline interval (e.g., '1m', '5m', '1h', '1d')
   */
  public subscribeToKline(symbol: string, interval: string): void {
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
    this.connectWebSocket([streamName]);
  }

  /**
   * Subscribe to order book updates
   * @param symbol Trading pair symbol (e.g., 'btcusdt')
   * @param level Update speed: 5, 10, or 20 (default)
   */
  public subscribeToDepth(symbol: string, level: number = 20): void {
    const streamName = `${symbol.toLowerCase()}@depth${level}`;
    this.connectWebSocket([streamName]);
  }

  /**
   * Subscribe to multiple streams at once
   * @param streams Array of stream names
   */
  public subscribeToMultipleStreams(streams: string[]): void {
    this.connectWebSocket(streams);
  }

  /**
   * Handle incoming WebSocket messages
   * @param message Message from WebSocket
   */
  private handleWebSocketMessage(message: any): void {
    // Handle combined stream format
    const data = message.data || message;
    const stream = message.stream || '';

    if (stream.includes('@ticker') || data.e === '24hrTicker') {
      this.handleTickerMessage(data);
    } else if (stream.includes('@kline') || data.e === 'kline') {
      this.handleKlineMessage(data);
    } else if (stream.includes('@depth') || data.e === 'depthUpdate') {
      this.handleDepthMessage(data);
    }
  }

  private handleTickerMessage(data: any): void {
    const ticker: BinanceTicker = {
      symbol: data.s,
      priceChange: data.p,
      priceChangePercent: data.P,
      weightedAvgPrice: data.w,
      lastPrice: data.c,
      lastQty: data.Q,
      bidPrice: data.b,
      bidQty: data.B,
      askPrice: data.a,
      askQty: data.A,
      openPrice: data.o,
      highPrice: data.h,
      lowPrice: data.l,
      volume: data.v,
      quoteVolume: data.q,
      openTime: data.O,
      closeTime: data.C,
      firstId: data.F,
      lastId: data.L,
      count: data.n
    };
    this.tickerSubject.next(ticker);
  }

  private handleKlineMessage(data: any): void {
    const k = data.k || data;
    const kline: BinanceKline = {
      openTime: k.t,
      open: k.o,
      high: k.h,
      low: k.l,
      close: k.c,
      volume: k.v,
      closeTime: k.T,
      quoteAssetVolume: k.q,
      trades: k.n,
      takerBuyBaseAssetVolume: k.V,
      takerBuyQuoteAssetVolume: k.Q,
      ignored: k.B
    };
    this.klineSubject.next(kline);
  }

  private handleDepthMessage(data: any): void {
    const depth: BinanceDepth = {
      lastUpdateId: data.lastUpdateId || data.u,
      bids: data.bids || [],
      asks: data.asks || []
    };
    this.depthSubject.next(depth);
  }

  /**
   * Get current price for a symbol using REST API
   * @param symbol Trading pair symbol (e.g., 'BTCUSDT')
   */
  public getPrice(symbol: string): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/v3/ticker/price`, {
      params: { symbol: symbol.toUpperCase() }
    }).pipe(
      map(response => parseFloat(response.price)),
      catchError(error => {
        console.error('Error fetching price:', error);
        return of(0);
      })
    );
  }

  /**
   * Get account information (requires API key)
   */
  public getAccountInfo(): Observable<any> {
    if (!this.apiKey || !this.secretKey) {
      console.error('API key and secret key are required for authenticated endpoints');
      return of(null);
    }

    const timestamp = Date.now();
    const params = new HttpParams().set('timestamp', timestamp.toString());
    
    const signature = this.generateSignature(params);
    
    const headers = new HttpHeaders({
      'X-MBX-APIKEY': this.apiKey
    });
    
    return this.http.get<any>(`${this.apiUrl}/v3/account`, {
      headers,
      params: params.set('signature', signature)
    }).pipe(
      catchError(error => {
        console.error('Error fetching account info:', error);
        return of(null);
      })
    );
  }

  /**
   * Place a new order (requires API key)
   * @param symbol Trading pair symbol
   * @param side 'BUY' or 'SELL'
   * @param type 'LIMIT', 'MARKET', etc.
   * @param quantity Amount to buy/sell
   * @param price Price for LIMIT orders
   */
  public placeOrder(symbol: string, side: string, type: string, 
                   quantity: string, price?: string): Observable<any> {
    if (!this.apiKey || !this.secretKey) {
      console.error('API key and secret key are required for authenticated endpoints');
      return of(null);
    }

    let params = new HttpParams()
      .set('symbol', symbol.toUpperCase())
      .set('side', side)
      .set('type', type)
      .set('quantity', quantity)
      .set('timestamp', Date.now().toString());
    
    if (price && type === 'LIMIT') {
      params = params.set('price', price)
        .set('timeInForce', 'GTC');
    }
    
    const signature = this.generateSignature(params);
    params = params.set('signature', signature);
    
    const headers = new HttpHeaders({
      'X-MBX-APIKEY': this.apiKey
    });
    
    return this.http.post<any>(`${this.apiUrl}/v3/order`, null, {
      headers,
      params
    }).pipe(
      catchError(error => {
        console.error('Error placing order:', error);
        return of(null);
      })
    );
  }

  /**
   * Generate HMAC SHA256 signature for API request
   * @param params HTTP parameters
   */
  private generateSignature(params: HttpParams): string {
    const queryString = params.toString();
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString();
  }

  /**
   * Clean up resources when service is destroyed
   */
  public ngOnDestroy(): void {
    this.closeWebSocket();
    this.destroy$.next();
    this.destroy$.complete();
    this.socketSubject.complete();
    this.tickerSubject.complete();
    this.klineSubject.complete();
    this.depthSubject.complete();
  }

  /**
   * Set API credentials
   * @param apiKey Binance API key
   * @param secretKey Binance Secret key
   */
  public setCredentials(apiKey: string, secretKey: string): void {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }
}
