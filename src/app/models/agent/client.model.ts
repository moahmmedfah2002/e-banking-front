/**
 * Client model for agent's client management
 */
export interface AgentClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dateJoined: number;
  status: 'active' | 'inactive' | 'pending';
  accountIds: string[];
  totalBalance: number;
  kycStatus: 'verified' | 'pending' | 'not_submitted';
  riskProfile: 'low' | 'medium' | 'high';
  agentNotes?: string;
}

/**
 * Client account summary model
 */
export interface ClientAccountSummary {
  id: string;
  clientId: string;
  type: 'checking' | 'savings' | 'investment' | 'crypto';
  balance: number;
  currency: string;
  name: string;
  isActive: boolean;
  createdAt: number;
  lastTransaction?: number;
}

/**
 * Client detailed profile model
 */
export interface ClientDetailedProfile extends AgentClient {
  accounts: ClientAccountSummary[];
  transactions: {
    total: number;
    recent: any[]; // Recent transactions
  };
  cryptoPortfolio: {
    totalValue: number;
    totalProfit: number;
  };
  contactHistory: {
    lastContact: number;
    scheduledContacts: any[];
  };
  documents: {
    id: string;
    name: string;
    type: string;
    uploadedAt: number;
    status: 'verified' | 'pending' | 'rejected';
  }[];
}
