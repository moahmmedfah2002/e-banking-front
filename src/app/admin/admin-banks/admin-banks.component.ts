import { Component, OnInit } from '@angular/core';
import { Bank } from '../../modele/Bank';
import { Agent } from '../../modele/Agent';
import { MOCK_BANKS, BANK_TYPES, BANK_STATUSES } from '../../modele/mock-banks';
import { NgForm } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-banks',
  standalone: false,
  templateUrl: './admin-banks.component.html',
  styleUrl: './admin-banks.component.css',  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdminBanksComponent implements OnInit {
submitNewAgent(_t399: NgForm) {
    if (_t399.valid) {
        // Create a new agent object from form values
        const agent: Agent = {
          id: this.generateNewAgentId(),
          nom: this.newAgent.nom,
          prenom: this.newAgent.prenom,
          email: this.newAgent.email,
          telephone: this.newAgent.telephone,
          clientIds: this.newAgent.clientIds || [],
          bank: this.selectedBank!
        };
        
        // Find the selected bank and add the new agent
        const bank = this.banks.find(b => b.id === this.selectedBank?.id);
        if (bank) {
            bank.agents.push(agent);
        }
        
        // Reset the form
        _t399.resetForm();
        
        // Hide the agent form
        this.hideAddAgentForm();
    }
}  generateNewAgentId(): number {
    // Find the maximum agent ID in all banks
    let maxId = 0;
    this.banks.forEach(bank => {
      bank.agents.forEach(agent => {
        const id = agent.id as number;
        if (id > maxId) {
          maxId = id;
        }
      });
    });
    
    // Return the next available ID
    return maxId + 1;
  }
hideAddAgentForm() {
    this.showAgentForm = false;
}
showAddAgentForm() {
    this.showAgentForm = true;
}
  banks: Bank[] = [];
  bankTypes: {[key: string]: string} = {};
  bankStatuses: {[key: string]: string} = {};
  
  currentView: 'grid' | 'list' = 'grid';
  selectedBankType: string = 'all';
  selectedStatus: string = 'all';
  // Modal properties
  showModal: boolean = false;
  selectedBank: Bank | null = null;
  
  // Add Agent form properties
  showAgentForm: boolean = false;
  newAgent: Partial<Agent> = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    clientIds: []
  };
  
  // Search and filter properties
  searchQuery: string = '';
  filteredBanks: Bank[] = [];
  
  // Add Bank Modal properties
  showAddBankModal: boolean = false;
  newBank: Bank = {
    id: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'Active',
    agents: []
  };
  availableBankTypes: string[] = ['Commercial Bank', 'Investment Bank', 'Cooperative Bank', 'Savings Bank', 'Central Bank'];
  availableStatuses: string[] = ['Active', 'Pending', 'Inactive'];
  
  ngOnInit(): void {
    // Load mock data
    this.banks = MOCK_BANKS;
    this.bankTypes = BANK_TYPES;
    this.bankStatuses = BANK_STATUSES;
    
    // Initialize filtered banks
    this.applyFilters();
  }
  
  getBankType(bankId: string): string {
    return this.bankTypes[bankId] || 'Unknown';
  }

  getBankStatus(bankId: string | ""): string {
    return this.bankStatuses[bankId] || 'Unknown';
  }
    getAgentCount(bankId: string): number {
    const bank = this.banks.find(b => b.id === bankId);
    return bank ? bank.agents.length : 0;
  }
  
  // Open modal with bank details
  openBankModal(bank: Bank): void {
    this.selectedBank = bank;
    this.showModal = true;
  }
  
  // Close modal
  closeModal(): void {
    this.showModal = false;
    this.selectedBank = null;
  }  toggleView(view: 'grid' | 'list'): void {
    this.currentView = view;
  }

  filterBanks(bankType: string): void {
    this.selectedBankType = bankType;
    this.applyFilters();
  }

  filterStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }
  
  // Apply all filters and search
  applyFilters(): void {
    // Start with all banks
    let result = [...this.banks];
    
    // Apply search if there's a query
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const searchLower = this.searchQuery.toLowerCase().trim();
      result = result.filter(bank => 
        bank.name.toLowerCase().includes(searchLower) || 
        bank.id.toLowerCase().includes(searchLower) ||
        bank.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply bank type filter
    if (this.selectedBankType !== 'all') {
      result = result.filter(bank => {
        const type = this.bankTypes[bank.id]?.toLowerCase();
        return type?.includes(this.selectedBankType);
      });
    }
    
    // Apply status filter
    if (this.selectedStatus !== 'all') {
      result = result.filter(bank => {
        const status = bank.status?.toLowerCase() || 'unknown';
        return status === this.selectedStatus;
      });
    }
    
    // Update filtered banks
    this.filteredBanks = result;
  }
  
  // Get filtered banks based on selected type and status
  getFilteredBanks(): Bank[] {
    return this.filteredBanks;
  }
  addNewBank(): void {
    // Reset the form
    this.newBank = {
      id: this.generateNewBankId(),
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'Active',
      agents: []
    };
    this.showAddBankModal = true;
  }
  
  
  // Generate a new unique bank ID
  generateNewBankId(): string {
    // Extract the highest numeric part from existing IDs
    let maxId = 0;
    this.banks.forEach(bank => {
      const matches = bank.id.match(/\d+$/);
      if (matches) {
        const idNumber = parseInt(matches[0], 10);
        if (idNumber > maxId) {
          maxId = idNumber;
        }
      }
    });
    
    // Create a new ID with the format "BNK" + zero-padded number
    const nextId = maxId + 1;
    return `BNK${nextId.toString().padStart(3, '0')}`;
  }
    // Submit the new bank form
  submitNewBank(form: NgForm): void {
    if (form.valid) {
      // Create a new bank object from form values
      const bank: Bank = { ...this.newBank };
      
      // Add the bank to the mock data
      this.banks.push(bank);
      
      // Update bank type
      const selectedType = form.value.bankType;
      this.bankTypes[bank.id] = selectedType;
      
      // Update filtered banks
      this.applyFilters();
      
      // Close the modal
      this.closeAddBankModal();
    }
  }
    // Close the add bank modal
  closeAddBankModal(): void {
    this.showAddBankModal = false;
  }
  
  // Close the edit bank modal
  closeEditBankModal(): void {
    this.showEditBankModal = false;
    this.bankToEdit = null;
  }
    // Submit the edit bank form
  submitEditBank(form: NgForm): void {
    if (form.valid && this.bankToEdit) {
      // Find the bank to update
      const bankIndex = this.banks.findIndex(b => b.id === this.bankToEdit!.id);
      if (bankIndex !== -1) {
        // Update the bank data
        this.banks[bankIndex] = { 
          ...this.bankToEdit,
          // Preserve the original agents
          agents: this.banks[bankIndex].agents 
        };
        
        // Update bank type if changed
        if (form.value.bankType) {
          this.bankTypes[this.bankToEdit.id] = form.value.bankType;
        }
        
        // Update bank status
        this.bankStatuses[this.bankToEdit.id] = this.bankToEdit.status || 'Active';
        
        // Update filtered banks
        this.applyFilters();
        
        // Close the modal
        this.closeEditBankModal();
        
        // Show success message
        alert('Bank updated successfully!');
      }
    }
  }

  manageAgents(bankId: string): void {
    // Find the bank and open modal
    const bank = this.banks.find(b => b.id === bankId);
    if (bank) {
      this.openBankModal(bank);
    }
  }
  // Properties for edit bank modal
  showEditBankModal: boolean = false;
  bankToEdit: Bank | null = null;
  originalBankType: string = '';
  
  editBank(bankId: string): void {
    // Find the bank by id
    const bank = this.getBankById(bankId);
    if (bank) {
      // Create a copy of the bank object to avoid direct mutation
      this.bankToEdit = { ...bank, agents: [...bank.agents] };
      // Store the original bank type for the form
      this.originalBankType = this.bankTypes[bankId] || '';
      this.showEditBankModal = true;
    }
  }  deleteBank(bankId: string): void {
    // Find the bank index in the array
    const bankIndex = this.banks.findIndex(b => b.id === bankId);
    if (bankIndex !== -1) {
      if (confirm(`Are you sure you want to delete ${this.banks[bankIndex].name}?`)) {
        // Remove the bank from the array
        this.banks.splice(bankIndex, 1);
        
        // Remove the bank from bank types and statuses
        delete this.bankTypes[bankId];
        delete this.bankStatuses[bankId];
        
        // Update filtered banks
        this.applyFilters();
        
        // Show success message
        alert('Bank deleted successfully!');
      }
    }
  }
  
  // Get bank by ID
  getBankById(bankId: string): Bank | undefined {
    return this.banks.find(b => b.id === bankId);
  }
  
  // Format agent name
  getAgentFullName(agent: Agent): string {
    return `${agent.prenom} ${agent.nom}`;
  }
}
