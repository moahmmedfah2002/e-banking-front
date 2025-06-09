export interface CryptoTransaction {
  id?: number;
  clientId: number;
  cryptoType: string; // 'BTC', 'ETH', 'ADA', 'SOL'
  amount: number;
  usdValue: number;
  transactionType: 'BUY' | 'SELL';
  timestamp: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  fromWallet?: string;
  toWallet?: string;
  fee?: number;
  notes?: string;
}
