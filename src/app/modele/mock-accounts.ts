import { Compte } from './Compte';
import { MOCK_TRANSACTIONS } from './mock-transactions';

// Mock checking accounts
export const MOCK_CHECKING_ACCOUNTS: Compte[] = [
  {
    numericCompte: '1234567890',
    solde: 4578.52,
    statue: true,
    dateCreation: new Date('2021-03-15'),
    typeCompte: 'Checking',
    transactions: MOCK_TRANSACTIONS.filter(t =>
      t.compteAdebit === '1234567890' || t.compteAcredit === '1234567890'
    )
  },
  {
    numericCompte: '2345678901',
    solde: 1289.37,
    statue: true,
    dateCreation: new Date('2022-01-10'),
    typeCompte: 'Checking',
    transactions: MOCK_TRANSACTIONS.filter(t =>
      t.compteAdebit === '2345678901' || t.compteAcredit === '2345678901'
    )
  }
];

// Mock savings accounts
export const MOCK_SAVINGS_ACCOUNTS: Compte[] = [
  {
    numericCompte: '3456789012',
    solde: 12750.00,
    statue: true,
    dateCreation: new Date('2021-05-20'),
    typeCompte: 'Savings',
    transactions: MOCK_TRANSACTIONS.filter(t =>
      t.compteAdebit === '3456789012' || t.compteAcredit === '3456789012'
    )
  },
  {
    numericCompte: '4567890123',
    solde: 5430.25,
    statue: true,
    dateCreation: new Date('2022-02-18'),
    typeCompte: 'Savings',
    transactions: MOCK_TRANSACTIONS.filter(t =>
      t.compteAdebit === '4567890123' || t.compteAcredit === '4567890123'
    )
  }
];

// Mock investment accounts
export const MOCK_INVESTMENT_ACCOUNTS: Compte[] = [
  {
    numericCompte: '5678901234',
    solde: 32450.75,
    statue: true,
    dateCreation: new Date('2021-07-12'),
    typeCompte: 'Investment',
    transactions: MOCK_TRANSACTIONS.filter(t =>
      t.compteAdebit === '5678901234' || t.compteAcredit === '5678901234'
    )
  }
];

// All mock accounts combined
export const MOCK_ACCOUNTS: Compte[] = [
  ...MOCK_CHECKING_ACCOUNTS,
  ...MOCK_SAVINGS_ACCOUNTS,
  ...MOCK_INVESTMENT_ACCOUNTS
];

// Account types
export const ACCOUNT_TYPES = ['Checking', 'Savings', 'Investment'];

// Current user accounts (both checking accounts and first savings account)
export const USER_ACCOUNTS = [
  '1234567890',
  '2345678901',
  '3456789012'
];
