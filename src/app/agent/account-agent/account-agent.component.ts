import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from '../../modele/Compte';
import { MOCK_ACCOUNTS, ACCOUNT_TYPES } from '../../modele/mock-accounts';
import { AccountService } from '../../services/account.service';

interface AccountStats {
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: number;
  inactiveAccounts: number;
}

interface AccountFilters {
  types: {
    checking: boolean;
    savings: boolean;
    investment: boolean;
  };
  status: {
    active: boolean;
    inactive: boolean;
  };
}

@Component({
  selector: 'app-account-agent',
  standalone: false,
  templateUrl: './account-agent.component.html',
  styleUrl: './account-agent.component.css'
})
export class AccountAgentComponent implements OnInit {
  // All accounts
  accounts: Compte[] = [];
  allAccounts: Compte[] = [];
  
  // Account statistics
  accountStats: AccountStats = {
    totalAccounts: 0,
    activeAccounts: 0,
    totalBalance: 0,
    inactiveAccounts: 0
  };

  // Filter dropdown visibility
  isFilterDropdownVisible: boolean = false;
  
  // Account form
  isAccountModalVisible: boolean = false;
  accountForm!: FormGroup;
  
  // Account edit state
  isEditMode: boolean = false;
  editAccountId: string | undefined;
  
  // Account view state
  isViewMode: boolean = false;
  selectedAccount: Compte | null = null;
  
  // Search functionality
  searchQuery: string = '';
  
  // Filters
  filters: AccountFilters = {
    types: {
      checking: false,
      savings: false,
      investment: false
    },
    status: {
      active: false,
      inactive: false
    }
  };

  // Sort option
  sortOption: string = 'date';
  
  // Available account types
  accountTypes: string[] = [];
  
  constructor(private accountService: AccountService, private fb: FormBuilder) {
    this.initializeAccountForm();
  }

  ngOnInit(): void {
    // Load all accounts
    this.loadAccounts();
    
    // Get available account types
    this.accountTypes = this.accountService.getAccountTypes();
  }

  // Initialize the account form
  initializeAccountForm(): void {
    this.accountForm = this.fb.group({
      typeCompte: ['', Validators.required],
      solde: [0, [Validators.required, Validators.min(0)]],
      statue: [true],
      clientId: ['', Validators.required]
    });
  }

  // Load all accounts
  loadAccounts(): void {
    // In a real app, we would fetch accounts from the service
    this.accounts = [...MOCK_ACCOUNTS];
    this.allAccounts = [...this.accounts];
    
    // Calculate account statistics
    this.calculateAccountStats();
  }

  // Calculate account statistics
  calculateAccountStats(): void {
    this.accountStats.totalAccounts = this.accounts.length;
    this.accountStats.activeAccounts = this.accounts.filter(a => a.statue).length;
    this.accountStats.inactiveAccounts = this.accounts.filter(a => !a.statue).length;
    this.accountStats.totalBalance = this.accounts.reduce((sum, account) => sum + (account.solde || 0), 0);
  }

  // Toggle account creation/edit modal
  toggleAccountModal(): void {
    this.isAccountModalVisible = !this.isAccountModalVisible;
    if (!this.isAccountModalVisible) {
      this.resetAccountForm();
      this.isEditMode = false;
      this.editAccountId = undefined;
    }
  }

  // Reset form
  resetAccountForm(): void {
    this.accountForm.reset({
      statue: true,
      solde: 0
    });
  }

  // Format account number for display
  formatAccountNumber(accountNumber: string | undefined): string {
    return this.accountService.formatAccountNumber(accountNumber);
  }

  // Format balance for display
  formatBalance(balance: number | undefined): string {
    return this.accountService.formatBalance(balance);
  }

  // Handle view account details
  viewAccount(account: Compte): void {
    this.selectedAccount = { ...account };
    this.isViewMode = true;
  }

  // Close view mode
  closeViewMode(): void {
    this.isViewMode = false;
    this.selectedAccount = null;
  }

  // Handle account form submission
  onAccountSubmit(): void {
    if (this.accountForm.invalid) {
      return;
    }
    
    const formValues = this.accountForm.value;
    
    if (this.isEditMode && this.editAccountId) {
      // Update existing account
      const accountIndex = this.accounts.findIndex(a => a.numericCompte === this.editAccountId);
      
      if (accountIndex !== -1) {
        // Update the account data
        const updatedAccount: Compte = {
          ...this.accounts[accountIndex],
          typeCompte: formValues.typeCompte,
          solde: formValues.solde,
          statue: formValues.statue
        };
        
        // In a real app, we would call the service to update the account
        this.accounts[accountIndex] = updatedAccount;
        
        // Update the allAccounts array
        this.allAccounts = [...this.accounts];
        
        console.log('Account updated successfully:', updatedAccount);
        this.showAlert('Account updated successfully', 'success');
      }
    } else {
      // Create new account
      const newAccount: Compte = {
        numericCompte: this.generateAccountNumber(),
        typeCompte: formValues.typeCompte,
        solde: formValues.solde,
        statue: formValues.statue,
        dateCreation: new Date()
      };
      
      // In a real app, we would call the service to create the account
      this.accounts.unshift(newAccount);
      this.allAccounts = [...this.accounts];
      
      console.log('Account created successfully:', newAccount);
      this.showAlert('Account created successfully', 'success');
    }
    
    // Recalculate statistics
    this.calculateAccountStats();
    
    // Close modal and reset form
    this.toggleAccountModal();
  }

  // Edit an account
  editAccount(account: Compte): void {
    this.isEditMode = true;
    this.editAccountId = account.numericCompte;
    
    this.accountForm.setValue({
      typeCompte: account.typeCompte || '',
      solde: account.solde || 0,
      statue: account.statue !== undefined ? account.statue : true,
      clientId: '' // In a real app, we would set this to the client ID
    });
    
    this.toggleAccountModal();
  }

  // Delete an account
  deleteAccount(accountNumber: string | undefined): void {
    if (!accountNumber) return;
    
    if (confirm('Are you sure you want to delete this account?')) {
      this.accounts = this.accounts.filter(account => account.numericCompte !== accountNumber);
      this.allAccounts = [...this.accounts];
      
      // Recalculate statistics
      this.calculateAccountStats();
      
      console.log('Account deleted successfully');
      this.showAlert('Account deleted successfully', 'success');
    }
  }

  // Toggle account status (active/inactive)
  toggleAccountStatus(account: Compte): void {
    if (!account.numericCompte) return;
    
    const accountIndex = this.accounts.findIndex(a => a.numericCompte === account.numericCompte);
    
    if (accountIndex !== -1) {
      this.accounts[accountIndex].statue = !this.accounts[accountIndex].statue;
      this.allAccounts = [...this.accounts];
      
      // Recalculate statistics
      this.calculateAccountStats();
      
      const statusText = this.accounts[accountIndex].statue ? 'activated' : 'deactivated';
      console.log(`Account ${statusText} successfully`);
      this.showAlert(`Account ${statusText} successfully`, 'success');
    }
  }

  // Apply filters
  applyFilters(): void {
    let filteredAccounts = [...this.allAccounts];
    
    // Apply type filters if any are selected
    const typeFilters = Object.values(this.filters.types).some(val => val);
    if (typeFilters) {
      filteredAccounts = filteredAccounts.filter(account => {
        if (this.filters.types.checking && account.typeCompte?.toLowerCase() === 'checking') return true;
        if (this.filters.types.savings && account.typeCompte?.toLowerCase() === 'savings') return true;
        if (this.filters.types.investment && account.typeCompte?.toLowerCase() === 'investment') return true;
        return false;
      });
    }
    
    // Apply status filters if any are selected
    const statusFilters = Object.values(this.filters.status).some(val => val);
    if (statusFilters) {
      filteredAccounts = filteredAccounts.filter(account => {
        if (this.filters.status.active && account.statue) return true;
        if (this.filters.status.inactive && !account.statue) return true;
        return false;
      });
    }
    
    // Apply search query if present
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredAccounts = filteredAccounts.filter(account => 
        account.numericCompte?.toLowerCase().includes(query) ||
        account.typeCompte?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    this.applySorting(filteredAccounts);
    
    this.accounts = filteredAccounts;
  }

  // Clear filters
  clearFilters(): void {
    this.filters = {
      types: {
        checking: false,
        savings: false,
        investment: false
      },
      status: {
        active: false,
        inactive: false
      }
    };
    
    this.accounts = [...this.allAccounts];
    this.applySorting(this.accounts);
  }

  // Apply sorting based on selected option
  applySorting(accounts: Compte[]): void {
    switch (this.sortOption) {
      case 'number':
        accounts.sort((a, b) => 
          (a.numericCompte || '').localeCompare(b.numericCompte || '')
        );
        break;
      case 'balance':
        accounts.sort((a, b) => 
          (b.solde || 0) - (a.solde || 0)
        );
        break;
      case 'type':
        accounts.sort((a, b) => 
          (a.typeCompte || '').localeCompare(b.typeCompte || '')
        );
        break;
      case 'date':
      default:
        accounts.sort((a, b) => 
          (b.dateCreation?.getTime() || 0) - (a.dateCreation?.getTime() || 0)
        );
        break;
    }
  }

  // Toggle filter dropdown
  toggleFilterDropdown(): void {
    this.isFilterDropdownVisible = !this.isFilterDropdownVisible;
  }

  // Click outside handler for dropdowns
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (!target.closest('#filter-dropdown-button') && 
        !target.closest('#filter-dropdown-content')) {
      this.isFilterDropdownVisible = false;
    }
  }

  // Clear search
  clearSearch(): void {
    this.searchQuery = '';
    this.accounts = [...this.allAccounts];
    this.applySorting(this.accounts);
  }

  // Search accounts
  searchAccounts(): void {
    this.applyFilters();
  }

  // Show alert message
  showAlert(message: string, type: 'success' | 'error' | 'info'): void {
    // In a real app, you would implement a toast/alert system
    console.log(`[${type}] ${message}`);
  }

  // Generate a random account number
  private generateAccountNumber(): string {
    return Math.floor(Math.random() * 9000000000) + 1000000000 + '';
  }
}
