/**
 * Agent dashboard summary model
 */
export interface AgentDashboardSummary {
  clientsCount: number;
  activeClientsCount: number;
  pendingApprovals: number;
  transactionsToday: number;
  transactionsThisMonth: number;
  totalManagedAssets: number;
  cryptoTransactionsToday: number;
  alerts: AgentAlert[];
  tasks: AgentTask[];
}

/**
 * Agent alert model
 */
export interface AgentAlert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: number;
  read: boolean;
  relatedClientId?: string;
  relatedTransactionId?: string;
}

/**
 * Agent task model
 */
export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high';
  dueDate: number;
  assignedAt: number;
  relatedClientId?: string;
  relatedTransactionId?: string;
}

/**
 * Agent performance metrics model
 */
export interface AgentPerformanceMetrics {
  period: string;
  transactionsProcessed: number;
  clientsAcquired: number;
  totalTransactionVolume: number;
  averageClientSatisfaction: number;
  responseTimeAverage: number;
}

/**
 * Client acquisition data model
 */
export interface ClientAcquisitionData {
  period: string;
  newClients: number;
  conversionRate: number;
  acquisitionCost: number;
  retentionRate: number;
  churnRate: number;
}

/**
 * Transaction volume data model
 */
export interface TransactionVolumeData {
  period: string;
  totalVolume: number;
  averageTransactionSize: number;
  transactionCount: number;
  byType: {
    banking: number;
    crypto: number;
    investment: number;
    other: number;
  };
}
