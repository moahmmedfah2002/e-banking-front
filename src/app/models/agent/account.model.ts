/**
 * Agent account model
 */
export interface AgentAccount {
  id: string;
  clientId: string;
  type: 'checking' | 'savings' | 'investment' | 'crypto';
  balance: number;
  currency: string;
  name: string;
  accountNumber: string;
  routingNumber?: string;
  isActive: boolean;
  openedAt: number;
  lastUpdated: number;
  interestRate?: number;
  features: {
    directDeposit: boolean;
    onlineBanking: boolean;
    mobileDeposit: boolean;
    billPay: boolean;
    overdraftProtection: boolean;
  };
}

/**
 * Account transaction model
 */
export interface AgentAccountTransaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee' | 'interest';
  amount: number;
  balance: number;
  description: string;
  category: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  reference?: string;
  metadata?: {
    [key: string]: any;
  };
}

/**
 * Account balance history data point
 */
export interface BalanceHistoryDataPoint {
  balance: number;
  timestamp: number;
}

/**
 * Account detailed information
 */
export interface AccountDetailedInfo extends AgentAccount {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  recentTransactions: AgentAccountTransaction[];
  balanceHistory: BalanceHistoryDataPoint[];
}
