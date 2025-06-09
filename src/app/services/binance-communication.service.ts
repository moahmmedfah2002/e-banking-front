import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CryptoRate } from '../modele/CryptoRate';

// Define an interface for websocket message responses
interface WebSocketMessage {
  s: string;  // symbol
  p: string;  // price
  q: string;  // quantity
  t: number;  // trade id
  E: number;  // event time
}

@Injectable({
  providedIn: 'root'
})
export class BinanceCommunicationService {
  private webSocket: WebSocket | null = null;
  private socketUrl = 'wss://stream.binance.com:9443/ws';
  
  // BehaviorSubjects to hold the latest rates for each cryptocurrency
  private bitcoinRate = new BehaviorSubject<CryptoRate>({ symbol: 'BTCUSDT', price: 0, lastUpdate: new Date() });
  private ethereumRate = new BehaviorSubject<CryptoRate>({ symbol: 'ETHUSDT', price: 0, lastUpdate: new Date() });
  private cardanoRate = new BehaviorSubject<CryptoRate>({ symbol: 'ADAUSDT', price: 0, lastUpdate: new Date() });
  private solanaRate = new BehaviorSubject<CryptoRate>({ symbol: 'SOLUSDT', price: 0, lastUpdate: new Date() });

  constructor() { 
    this.initWebSocket();
  }

  private initWebSocket(): void {
    this.webSocket = new WebSocket(this.socketUrl);

    this.webSocket.onopen = () => {
      console.log('WebSocket connection established');
      // Subscribe to default streams after connection is established
      this.subscribeToTrades(['btcusdt', 'ethusdt', 'adausdt', 'solusdt']);
    };

    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed');
      // Try to reconnect after a delay
      setTimeout(() => this.initWebSocket(), 5000);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.webSocket.onmessage = (event) => {
      this.handleWebSocketMessage(event);
    };
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data: WebSocketMessage = JSON.parse(event.data);
      
      if (data.s && data.p) {
        const symbol = data.s.toUpperCase();
        const price = parseFloat(data.p);
        const timestamp = new Date();
        
        // Update the appropriate BehaviorSubject based on the symbol
        switch (symbol) {
          case 'BTCUSDT':
            this.bitcoinRate.next({ symbol, price, lastUpdate: timestamp });
            break;
          case 'ETHUSDT':
            this.ethereumRate.next({ symbol, price, lastUpdate: timestamp });
            break;
          case 'ADAUSDT':
            this.cardanoRate.next({ symbol, price, lastUpdate: timestamp });
            break;
          case 'SOLUSDT':
            this.solanaRate.next({ symbol, price, lastUpdate: timestamp });
            break;
        }
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // Connect to WebSocket and subscribe to streams
  public connectWebSocket(streams: string[]): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      const subscribeMessage = {
        method: 'SUBSCRIBE',
        params: streams,
        id: new Date().getTime()
      };
      
      this.webSocket.send(JSON.stringify(subscribeMessage));
    } else {
      console.error('WebSocket is not open. Cannot subscribe to streams.');
    }
  }
  
  // Subscribe to trade streams
  private subscribeToTrades(symbols: string[]): void {
    const streams = symbols.map(symbol => `${symbol}@trade`);
    this.connectWebSocket(streams);
  }
  
  // Get observable for Bitcoin rate
  public getBitcoinRate(): Observable<CryptoRate> {
    return this.bitcoinRate.asObservable();
  }
  
  // Get observable for Ethereum rate
  public getEthereumRate(): Observable<CryptoRate> {
    return this.ethereumRate.asObservable();
  }
  
  // Get observable for Cardano rate
  public getCardanoRate(): Observable<CryptoRate> {
    return this.cardanoRate.asObservable();
  }
  
  // Get observable for Solana rate
  public getSolanaRate(): Observable<CryptoRate> {
    return this.solanaRate.asObservable();
  }
}
