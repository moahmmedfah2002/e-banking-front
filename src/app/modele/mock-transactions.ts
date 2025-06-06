import { Transaction } from './Transaction';

// Mock data for transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    monet: 84.32,
    dateTransaction: new Date('2023-05-15T10:23:00'),
    typeTransaction: 'Sortante',
    compteAdebit: '1234567890', // User's account
    compteAcredit: '9876543210',
  },
  {
    id: 2,
    monet: 2450.00,
    dateTransaction: new Date('2023-05-12T00:01:00'),
    typeTransaction: 'Entrante',
    compteAdebit: '8765432109',
    compteAcredit: '1234567890', // User's account
  },
  {
    id: 3,
    monet: 142.57,
    dateTransaction: new Date('2023-05-10T09:45:00'),
    typeTransaction: 'Sortante',
    compteAdebit: '1234567890', // User's account
    compteAcredit: '5432109876',
  },
  {
    id: 4,
    monet: 215.33,
    dateTransaction: new Date('2023-05-08T14:30:00'),
    typeTransaction: 'Sortante',
    compteAdebit: '1234567890', // User's account
    compteAcredit: '6789054321',
  },
  {
    id: 5,
    monet: 1200.00,
    dateTransaction: new Date('2023-05-05T09:15:00'),
    typeTransaction: 'Entrante',
    compteAdebit: '5678901234',
    compteAcredit: '1234567890', // User's account
  }
];

// User's account numbers for reference
export const USER_ACCOUNTS = ['1234567890', '2345678901'];
