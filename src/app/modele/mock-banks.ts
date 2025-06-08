import { Bank } from './Bank';
import { Agent } from './Agent';
import { User } from './User';

// Create sample agent data
const createAgent = (id: number, nom: string, prenom: string, email: string, telephone: string, bankId: string, branch: string): Agent => {
  return {
    id,
    nom,
    prenom,
    email,
    telephone,
    identifiant: `${prenom.toLowerCase()[0]}${nom.toLowerCase()}`,

    estActif: true,
    bank: { id: bankId } as Bank, // partial reference to avoid circular dependency
    clientIds: []
  };
};

export const MOCK_BANKS: Bank[] = [
  {
    id: 'FNB001',
    name: 'First National Bank',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 (212) 555-1234',
    email: 'info@fnb.com',
    agents: [
      createAgent(1, 'Smith', 'John', 'jsmith@fnb.com', '+1 (212) 555-1001', 'FNB001', 'Main Branch'),
      createAgent(2, 'Johnson', 'Emily', 'ejohnson@fnb.com', '+1 (212) 555-1002', 'FNB001', 'Downtown'),
      createAgent(3, 'Williams', 'Michael', 'mwilliams@fnb.com', '+1 (212) 555-1003', 'FNB001', 'Uptown')
    ]
  },  {
    id: 'GIB002',
    name: 'Global Investment Bank',
    address: '456 Wall Street, New York, NY 10005',
    phone: '+1 (212) 555-5678',
    email: 'contact@gib.com',
    agents: [
      createAgent(4, 'Brown', 'Robert', 'rbrown@gib.com', '+1 (212) 555-5001', 'GIB002', 'Investment Division'),
      createAgent(5, 'Taylor', 'Sarah', 'staylor@gib.com', '+1 (212) 555-5002', 'GIB002', 'Wealth Management')
    ]
  },
  {
    id: 'CSB003',
    name: 'Community Savings Bank',
    address: '789 Oak Avenue, Chicago, IL 60601',
    phone: '+1 (312) 555-8901',
    email: 'support@southernbank.com',
    agents: []
  },
  {
    id: 'PTCU004',
    name: 'Pacific Trust Credit Union',
    address: '321 Palm Drive, San Francisco, CA 94101',
    phone: '+1 (415) 555-2345',
    email: 'info@pacifictrust.com',
    agents: [
      createAgent(6, 'Garcia', 'Maria', 'mgarcia@pacifictrust.com', '+1 (415) 555-2001', 'PTCU004', 'Downtown SF'),
      createAgent(7, 'Chen', 'David', 'dchen@pacifictrust.com', '+1 (415) 555-2002', 'PTCU004', 'Oakland Branch')
    ]
  },
  {
    id: 'MRB005',
    name: 'Midwest Regional Bank',
    address: '567 River Road, St. Louis, MO 63101',
    phone: '+1 (314) 555-5678',
    email: 'info@midwestbank.com',
    agents: [
      createAgent(8, 'Miller', 'James', 'jmiller@midwestbank.com', '+1 (314) 555-5001', 'MRB005', 'St. Louis Main')
    ]
  },
  {
    id: 'SSB006',
    name: 'Southern States Bank',
    address: '890 Peachtree Street, Atlanta, GA 30301',
    phone: '+1 (404) 555-7890',
    email: 'contact@southernstatesbank.com',
    agents: [
      createAgent(9, 'Wilson', 'Thomas', 'twilson@southernstatesbank.com', '+1 (404) 555-7001', 'SSB006', 'Peachtree Branch'),
      createAgent(10, 'Davis', 'Jessica', 'jdavis@southernstatesbank.com', '+1 (404) 555-7002', 'SSB006', 'Buckhead')
    ]
  }
];

export const BANK_TYPES = {
  'FNB001': 'Commercial Bank',
  'GIB002': 'Investment Bank',
  'CSB003': 'Savings Bank',
  'PTCU004': 'Cooperative Bank',
  'MRB005': 'Commercial Bank',
  'SSB006': 'Commercial Bank'
};

export const BANK_STATUSES = {
  'FNB001': 'Active',
  'GIB002': 'Active',
  'CSB003': 'Pending',
  'PTCU004': 'Active',
  'MRB005': 'Inactive',
  'SSB006': 'Active'
};

export const BANK_AGENT_COUNTS = {
  'FNB001': 3,
  'GIB002': 2,
  'CSB003': 0,
  'PTCU004': 2,
  'MRB005': 1,
  'SSB006': 2
};
