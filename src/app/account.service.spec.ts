import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AccountService } from './account.service';
import { Compte } from './modele/Compte';
import { ACCOUNT_TYPES, USER_ACCOUNTS } from './modele/mock-accounts';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountService]
    });
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user accounts', () => {
    service.getAccounts().subscribe(accounts => {
      expect(accounts.length).toBeGreaterThan(0);
      accounts.forEach(account => {
        expect(USER_ACCOUNTS).toContain(account.numericCompte || "");
      });
    });
  });

  it('should return accounts by type', () => {
    service.getAccountsByType('checking').subscribe(accounts => {
      expect(accounts.length).toBeGreaterThan(0);
      accounts.forEach(account => {
        expect(account.typeCompte?.toLowerCase()).toBe('checking');
      });
    });
  });

  it('should get available account types', () => {
    const types = service.getAccountTypes();
    expect(types).toEqual(ACCOUNT_TYPES);
  });

  it('should format account number', () => {
    const formatted = service.formatAccountNumber('1234567890');
    expect(formatted).toBe('****7890');
  });

  it('should format account balance', () => {
    const formatted = service.formatBalance(1234.56);
    expect(formatted).toBe('$1234.56');
  });

  it('should create a new account', () => {
    const newAccount: Compte = {
      typeCompte: 'Checking',
      solde: 500
    };

    service.createAccount(newAccount).subscribe(account => {
      expect(account.solde).toBe(500);
      expect(account.typeCompte).toBe('Checking');
      expect(account.statue).toBe(true);
      expect(account.dateCreation).toBeDefined();
      expect(account.transactions).toEqual([]);
    });
  });

  it('should handle account opening with valid data', () => {
    service.openAccount('Savings', 1000).subscribe(account => {
      expect(account.typeCompte).toBe('Savings');
      expect(account.solde).toBe(1000);
      expect(account.statue).toBe(true);
      expect(account.numericCompte).toBeDefined();
    });
  });

  it('should reject account opening with negative initial deposit', (done) => {
    service.openAccount('Checking', -100).subscribe({
      next: () => {
        fail('Should have rejected negative deposit');
        done();
      },
      error: (error) => {
        expect(error.message).toContain('negative');
        done();
      }
    });
  });
});
