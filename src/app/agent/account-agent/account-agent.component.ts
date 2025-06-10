import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Compte } from '../../modele/Compte';
import { Client } from '../../modele/Client'; // Import Client model
import { ACCOUNT_TYPES } from '../../modele/mock-accounts';
import { AgentAccountService } from '../../services/agent-services/agent-account/agent-account.service';
import { AccountService } from '../../services/account.service';
import { HomeService } from '../../services/homeService';
import { AgentClientService } from '../../services/agent-services/agent-client/agent-client.service';

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
  clients: Client[] = []; // Add clients array
  
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
  selectedAccount: Compte = new Compte(); // Initialize with empty Compte object
  
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
    constructor(
    private accountService: AccountService,
    private agentAccountService: AgentAccountService,
    private agentClientService: AgentClientService, // Inject AgentClientService
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.initializeAccountForm();
  }

  ngOnInit(): void {
    // Load all accounts
    this.loadAccounts();
    this.loadClients(); // Call loadClients
    
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
    this.agentAccountService.getAccounts(
      sessionStorage.getItem('user') ? parseInt(JSON.parse(sessionStorage.getItem('user') || "{}").id) : parseInt(JSON.parse(localStorage.getItem('user') || "{}").id)
    ).subscribe({
      next: (accounts: Compte[]) => { // Add type for accounts
        this.accounts = accounts;
        this.allAccounts = [...accounts];
        // Calculate account statistics
        this.calculateAccountStats();
      },
      error: (error: any) => { // Add type for error
        console.error('Error loading accounts:', error);
        this.showAlert('Error loading accounts', 'error');
      }
    });
  }

  // Load all clients
  loadClients(): void {
    this.agentClientService.getClients().subscribe({ // Assuming getClients method exists in AgentClientService
      next: (clients: Client[]) => { // Add type for clients
        this.clients = clients;
      },
      error: (error: any) => { // Add type for error
        console.error('Error loading clients:', error);
        this.showAlert('Error loading clients', 'error');
      }
    });
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
      typeCompte: '',
      solde: 0,
      statue: true,
      clientId: ''
    });
    this.accountForm.markAsPristine();
    this.accountForm.markAsUntouched();
  }

  // Format account number for display
  formatAccountNumber(accountNumber: string | undefined): string {
    return this.accountService.formatAccountNumber(accountNumber);
  }

  // Format balance for display
  formatBalance(balance: number | undefined): string {
    return this.accountService.formatBalance(balance);
  }
  
  // Format date for display
  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'MMM d, y') || '';
  }

  // Handle view account details
  viewAccount(account: Compte): void {
    this.selectedAccount = { ...account };
    this.isViewMode = true;
  }

  // Close view mode
  closeViewMode(): void {
    this.isViewMode = false;
    this.selectedAccount = new Compte(); // Reset selected account
  }

  // Handle account form submission
  onAccountSubmit(): void {
    if (this.accountForm.invalid) {
      return;
    }
    
    const formValues = this.accountForm.value;
    console.log('Form values:', formValues);
    
    if (this.isEditMode && this.editAccountId) {
      const accountToUpdate: Compte = { 
        numericCompte: this.editAccountId,
        typeCompte: formValues.typeCompte,
        solde: formValues.solde,
        statue: formValues.statue,
        client: formValues.clientId 
      };
      
      console.log('Updating account:', accountToUpdate);
        
      this.agentAccountService.updateAccount(accountToUpdate).subscribe({
        next: (updatedAccount: Compte) => {
          const index = this.accounts.findIndex(a => a.numericCompte === this.editAccountId);
          if (index !== -1) {
            this.accounts[index] = updatedAccount;
            this.allAccounts = [...this.accounts];
          }
          this.showAlert('Account updated successfully', 'success');
          this.calculateAccountStats();
          this.loadAccounts(); // Reload accounts after update
          this.toggleAccountModal();
        },
        error: (error: any) => {
          console.error('Error updating account:', error);
          this.showAlert('Error updating account', 'error');
        }
      });

    } else {
      // Create new account
      const newAccount: Compte = {
        typeCompte: formValues.typeCompte,
        solde: formValues.solde,
        statue: formValues.statue,
        dateCreation: new Date(),
      };
      
      console.log('Creating account:', newAccount);
      
      this.agentAccountService.createAccountToClient(
        formValues.clientId, // Pass clientId directly
        newAccount
      ).subscribe({
      next: () => {
          this.loadAccounts(); // Reload accounts after creation
      }});

      this.agentAccountService.createAccount(newAccount).subscribe({
        next: (createdAccount: Compte) => {
          this.accounts.unshift(createdAccount);
          this.allAccounts = [...this.accounts];
          this.showAlert('Account created successfully', 'success');
          this.calculateAccountStats();
          this.toggleAccountModal();
        },
        error: (error: any) => {
          console.error('Error creating account:', error);
          this.showAlert('Error creating account', 'error');
        }
      });
    }
  }

  // Edit an account
  editAccount(account: Compte): void {
    this.isEditMode = true;
    this.editAccountId = account.numericCompte;
    
    this.accountForm.setValue({
      typeCompte: account.typeCompte || '',
      solde: account.solde || 0,
      statue: account.statue !== undefined ? account.statue : true,
      clientId: account.client || '' // Populate clientId from account.client
    });

    this.toggleAccountModal();
  }

  // Delete an account
  deleteAccount(accountNumber: string | undefined): void {
    if (!accountNumber) return;
    if (confirm('Are you sure you want to delete this account?')) {
      this.agentAccountService.deleteAccount(parseInt(accountNumber)).subscribe({
        next: () => {
          this.accounts = this.accounts.filter(account => account.numericCompte !== accountNumber);
          this.allAccounts = [...this.accounts];
          this.calculateAccountStats();
          this.showAlert('Account deleted successfully', 'success');
        },
        error: (error: Error) => {
          console.error('Error deleting account:', error);
          this.showAlert('Error deleting account', 'error');
        }
      });
    }
  }

  // Toggle account status (active/inactive)
  toggleAccountStatus(account: Compte): void {
    if (!account.numericCompte) return;
    
    const updatedAccount: Compte = {
      ...account,
      statue: !account.statue
    };
    
    this.agentAccountService.changeAccountStatus(parseInt(updatedAccount.numericCompte || ""),!account.statue).subscribe(
      (result: Compte) => {
        this.loadAccounts();
      },
      (error: any) => {
        console.error('Error toggling account status:', error);
        this.showAlert('Error updating account status', 'error');
      }
    );
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
