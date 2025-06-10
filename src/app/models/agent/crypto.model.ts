/**
 * Agent crypto transaction model
 */
export interface AgentCryptoTransaction {
  id: string;
  clientId: string;
  clientName?: string;
  symbol: string;  // BTC, ETH, etc.
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
}

/**
 * Crypto price data model
 */
export interface CryptoPriceData {
  symbol: string;
  price: number;
  change24h: number;  // Percentage change in 24 hours
  volume24h: number;  // Trading volume in 24 hours
  marketCap: number;
  timestamp: number;
}

/**
 * Historical price data point
 */
export interface PriceDataPoint {
  price: number;
  timestamp: number;
}

/**
 * Crypto statistics model
 */
export interface CryptoStatistics {
  totalTransactions: number;
  activeCryptos: number;
  totalBought: number;
  totalSold: number;
  lastUpdated: number;
}

/**
 * Crypto portfolio item model
 */
export interface CryptoPortfolioItem {
  symbol: string;
  amount: number;
  averageBuyPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

/**
 * Crypto portfolio summary model
 */
export interface CryptoPortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalProfit: number;
  profitPercentage: number;
  items: CryptoPortfolioItem[];
}
