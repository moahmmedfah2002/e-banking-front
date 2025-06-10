// filepath: d:\projects\Frontend-always-brake\e-banking-front\src\app\agent\agent-client\agent-client.component.ts
import { Component, OnInit } from '@angular/core';
import { Filters, UserDisplay, UserStats } from '../../admin/admin-users/admin-users.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../modele/Role';
import { Client } from '../../modele/Client';
import { AgentClientService } from '../../services/agent-services/agent-client/agent-client.service';

@Component({
  selector: 'app-agent-client',
  standalone: false,
  templateUrl: './agent-client.component.html',
  styleUrl: './agent-client.component.css',
  host: {
    '(document:click)': 'onClickOutside($event)',
  }
})
export class AgentClientComponent implements OnInit {
  userStats: UserStats = {
    totalUsers: 0,
    totalIncrease: 0,
    activeUsers: 0,
    activeIncrease: 0,
    adminsAndManagers: 0,
    adminsChange: 'N/A',
    flaggedAccounts: 0,
    flaggedIncrease: 0
  };
  
  // Client data
  users: UserDisplay[] = [];
  allUsers: UserDisplay[] = [];

  // Filter dropdown visibility
  isFilterDropdownVisible: boolean = false;

  // Client form properties
  isClientModalVisible: boolean = false;
  clientForm!: FormGroup;

  // Client edit state
  isEditMode: boolean = false;
  editClientId: number | undefined;

  // Client view state
  isViewMode: boolean = false;
  selectedClient: UserDisplay | null = null;

  // Search functionality
  searchQuery: string = '';

  // Filters
  filters: Filters = {
    roles: {
      admin: false,
      manager: false,
      agent: false,
      user: false
    },
    status: {
      active: false,
      inactive: false,
      flagged: false
    },
    clientInfo: {
      hasAccounts: false,
      newClient: false
    }
  };
  
  // Sort option
  sortOption: string = 'name';
  
  // Alert handling
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  alertTimeout: any;
  
  // Active dropdown ID to track open action menus
  activeDropdownId: number | null = null;
  
  constructor(
    private fb: FormBuilder,
    private agentClientService: AgentClientService
  ) {
    this.initializeClientForm();
  }

  ngOnInit(): void {
    this.loadClients();
  }

  
  /**
   * Initialize the client form
   */

  private initializeClientForm(): void {
    this.clientForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      pays: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      cin: ['', Validators.required]
    });

  }
  
  /**
   * Get active users count
   */
  getActiveUsersCount(): number {
    return this.users.filter(user => user.estActif).length;
  }
  
  /**
   * Load clients from the service
   */  loadClients(): void {
    this.agentClientService.getClients().subscribe(
      (clients) => {
        // Map API clients to UserDisplay format
        this.users = clients.map(client => this.mapClientToUserDisplay(client));
        this.allUsers = [...this.users];
        
        // Apply sorting to the initial data
        this.applySorting(this.users);
        
        // Apply any active filters to the loaded data
        if (Object.values(this.filters.roles).some(v => v) ||
            Object.values(this.filters.status).some(v => v) ||
            Object.values(this.filters.clientInfo).some(v => v)) {
          this.applyFilters();
        }
        
        // Update user statistics
        this.userStats.totalUsers = this.allUsers.length;
        this.userStats.activeUsers = this.allUsers.filter(user => user.estActif).length;
      },
      (error) => {
        console.error('Error loading clients:', error);
        this.showAlert('Failed to load clients. Please try again.', 'error');
      }
    );
  }

  /**
   * Load client statistics from the service
   */
  

  /**
   * Map a Client object to UserDisplay format
   */
  mapClientToUserDisplay(client: Client): UserDisplay {
    const initials = `${client.prenom?.charAt(0) || ''}${client.nom?.charAt(0) || ''}`;
    
    // Determine last login text - this would ideally come from your backend
    let lastLogin = 'Never';
    
    // Determine status styling
    const statusClass = client.estActif 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
    
    return {
      ...client,
      initials,
      lastLogin,
      statusClass,
      roleBadgeClass: 'role-badge-user',
      roleIcon: 'fas fa-user',
      roleLabel: 'Client'
    };
  }
  
  /**
   * Toggle filter dropdown
   */
  toggleFilterDropdown(): void {
    this.isFilterDropdownVisible = !this.isFilterDropdownVisible;
  }
  
  /**
   * Handle search input changes
   */
  onSearchChange(): void {
    this.searchClients();
  }
  
  /**
   * Search clients using the service
   */  searchClients(): void {
    if (!this.searchQuery.trim()) {
      // If search is empty, load all clients
      this.loadClients();
      return;
    }
    
    // Perform the search on the client-side since there's no backend
    const query = this.searchQuery.toLowerCase().trim();
    const searchResults = this.allUsers.filter(client => 
      client.prenom?.toLowerCase().includes(query) ||
      client.nom?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.telephone?.toLowerCase().includes(query) ||
      client.cin?.toLowerCase().includes(query) ||
      `${client.prenom} ${client.nom}`.toLowerCase().includes(query)
    );
    
    // Update the current users array with search results
    this.users = searchResults;
    
    // Apply any active filters to the search results
    if (this.hasActiveFilters()) {
      this.applyFilters();
    } else {
      // Just apply sorting if no filters are active
      this.applySorting(this.users);
    }
    
    // Show feedback if no results found
    if (this.users.length === 0) {
      this.showAlert(`No clients found matching "${this.searchQuery}"`, 'error', 3000);
    }
  }
  
  /**
   * Apply filters to the client list
   */
  applyFilters(): void {
    let filteredUsers = [...this.allUsers];    // Apply role filters if any are selected
    const roleFilters = Object.values(this.filters.roles).some(val => val);
    if (roleFilters) {
      filteredUsers = filteredUsers.filter(user => {
        // Since this is client management, we only show users with the user role filter enabled
        return this.filters.roles.user;
      });
    }    // Apply status filters if any are selected
    const statusFilters = Object.values(this.filters.status).some(val => val);
    if (statusFilters) {
      filteredUsers = filteredUsers.filter(user => {
        if (this.filters.status.active && user.estActif) return true;
        if (this.filters.status.inactive && !user.estActif) return true;
        // For flagged users, check if statusClass includes 'red'
        if (this.filters.status.flagged && user.statusClass?.includes('red')) return true;
        return false; // If no status filter matches, exclude the user
      });
    }    // Apply client info filters
    const clientInfoFilters = Object.values(this.filters.clientInfo).some(val => val);
    if (clientInfoFilters) {
      filteredUsers = filteredUsers.filter(user => {
        if (this.filters.clientInfo.hasAccounts && user.comptes && user.comptes.length > 0) return true;
        if (this.filters.clientInfo.newClient && user.dateCreation) {
          // Consider clients created within the last 30 days as new
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const creationDate = user.dateCreation instanceof Date ? 
                               user.dateCreation : 
                               new Date(user.dateCreation);
          return creationDate >= thirtyDaysAgo;
        }
        return false; // If no client info filter matches, exclude the user
      });
    }

    // Apply sorting
    this.applySorting(filteredUsers);

    this.users = filteredUsers;
    
    // Close the filter dropdown after applying filters
    this.isFilterDropdownVisible = false;
  }

  
  /**
   * Clear all filters
   */


  clearFilters(): void {
    // Reset all filters
    this.filters = {
      roles: {
        admin: false,
        manager: false,
        agent: false,
        user: false
      },
      status: {
        active: false,
        inactive: false,
        flagged: false
      },
      clientInfo: {
        hasAccounts: false,
        newClient: false
      }
    };

    // Reset the user list to all users
    this.users = [...this.allUsers];
    
    // Apply the current sort option
    this.applySorting(this.users);
    
    // Close the filter dropdown
    this.isFilterDropdownVisible = false;
    
    // Show a success message
    this.showAlert('Filters cleared', 'success', 1500);
  }

  
  /**
   * Apply sorting to a list of users
   */
  applySorting(userList: UserDisplay[]): void {
    switch(this.sortOption) {
      case 'name':
        userList.sort((a, b) => `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`));
        break;
      case 'role':
        userList.sort((a, b) => (a.roleLabel || '').localeCompare(b.roleLabel || ''));
        break;
      case 'status':
        userList.sort((a, b) => {
          if (a.estActif === b.estActif) return 0;
          return a.estActif ? -1 : 1;
        });
        break;
      case 'lastLogin':
        userList.sort((a, b) => (a.lastLogin || '').localeCompare(b.lastLogin || ''));
        break;
      case 'dateCreated':
        userList.sort((a, b) => {
          // Handle cases where dateCreation might be undefined or a string instead of a Date
          if (!a.dateCreation && !b.dateCreation) return 0;
          if (!a.dateCreation) return 1;  // a is undefined, b comes first
          if (!b.dateCreation) return -1; // b is undefined, a comes first
          
          // Convert to Date objects if they're strings
          const dateA = a.dateCreation instanceof Date ? a.dateCreation : new Date(a.dateCreation);
          const dateB = b.dateCreation instanceof Date ? b.dateCreation : new Date(b.dateCreation);
          
          // Sort newest first
          return dateB.getTime() - dateA.getTime();
        });
        break;
      default:
        break;
    }
  }
  
  /**
   * Handle sort option change
   */
  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortOption = target.value;
    this.applySorting(this.users);
  }

  
  /**
   * Handle clicks outside of components (for dropdowns/modals)
   */

  onClickOutside(event: MouseEvent): void {
    // Close filter dropdown if clicked outside
    const filterDropdownBtn = document.querySelector('#filter-dropdown-btn') as HTMLElement;
    const filterDropdown = document.querySelector('.filter-dropdown') as HTMLElement;

    // Check if the click was outside both the button and the dropdown
    if (filterDropdownBtn && filterDropdown &&
        !filterDropdownBtn.contains(event.target as Node) &&
        !filterDropdown.contains(event.target as Node)) {
      this.isFilterDropdownVisible = false;
    }

    // Close user action dropdown menus if clicked outside
    if (this.activeDropdownId !== null) {
      const actionDropdown = document.querySelector('.origin-top-right') as HTMLElement;
      const actionBtn = document.querySelector(`button[data-user-id="${this.activeDropdownId}"]`) as HTMLElement;

      if (!actionDropdown || !actionDropdown.contains(event.target as Node)) {
        if (!actionBtn || !actionBtn.contains(event.target as Node)) {
          this.activeDropdownId = null;
        }
      }
    }

    
    // Close client modal if clicked outside
    const modalElement = document.querySelector('.modal-content') as HTMLElement;
    const addButton = document.getElementById('btn-add-user');
    
    if (this.isClientModalVisible && 
        modalElement && 
        !modalElement.contains(event.target as Node) && 
        addButton && 
        !addButton.contains(event.target as Node)) {
      this.isClientModalVisible = false;

      this.resetClientForm();
    }
  }
  
  /**
   * Toggle client modal visibility
   */
  toggleClientModal(client?: UserDisplay): void {
    this.isClientModalVisible = !this.isClientModalVisible;
    
    if (this.isClientModalVisible && client) {
      // Edit mode
      this.isEditMode = true;
      this.editClientId = client.id;
      this.clientForm.patchValue({
        prenom: client.prenom,
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
        adresse: client.adresse,
        ville: client.ville,
        codePostal: client.codePostal,
        pays: client.pays,
        dateNaissance: client.dateNaissance instanceof Date ? 
          this.formatDateForInput(client.dateNaissance) : '',
        cin: client.cin
      });
      // Don't require password in edit mode
      this.clientForm.get('password')?.clearValidators();
      this.clientForm.get('password')?.updateValueAndValidity();
    } else if (this.isClientModalVisible) {
      // Add mode
      this.isEditMode = false;
      this.editClientId = undefined;
      this.resetClientForm();
      // Require password in add mode
      this.clientForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.clientForm.get('password')?.updateValueAndValidity();
    } else {
      // Modal is closing
      this.resetClientForm();
      this.isEditMode = false;
      this.editClientId = undefined;
    }
  }
  
  /**
   * Reset client form
   */
  resetClientForm(): void {
    this.clientForm.reset();
  }

  
  /**
   * Handle client form submission
   */

  onClientSubmit(): void {
    if (this.isEditMode) {
      this.updateClient();
    } else {
      this.createClient();
    }
  }
  
  /**
   * Create a new client
   */
  createClient(): void {
    if (this.clientForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.clientForm.controls).forEach(key => {
        this.clientForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValues = this.clientForm.value;
    
    // Create client object from form values
    const client: Client = {
      id: 0, // This will be set by the backend
      nom: formValues.nom,
      prenom: formValues.prenom,
      email: formValues.email,
      telephone: formValues.telephone,
      identifiant: `${formValues.prenom.toLowerCase()[0]}${formValues.nom.toLowerCase()}`, // Generate a default username
      password: formValues.password,
      role: Role.CLIENT,
      estActif: true,
      dateCreation: new Date(),
      numeroClient: 0, // This will be set by the backend
      adresse: formValues.adresse,
      ville: formValues.ville,
      codePostal: formValues.codePostal,
      pays: formValues.pays,
      dateNaissance: new Date(formValues.dateNaissance),
      cin: formValues.cin,
      comptes: []
    };

    this.agentClientService.addClient(client).subscribe(
      (newClient) => {
        // Add to local data for UI
        const displayClient = this.mapClientToUserDisplay(newClient);
        this.users.unshift(displayClient);
        this.allUsers = [...this.users];
        
        this.showAlert('Client created successfully', 'success');
        this.isClientModalVisible = false;
      },
      (error) => {
        console.error('Error creating client:', error);
        this.showAlert('Failed to create client. Please try again.', 'error');
      }
    );
  }

  /**
   * Update an existing client
   */
  updateClient(): void {
    if (this.clientForm.invalid || !this.editClientId) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.clientForm.controls).forEach(key => {
        this.clientForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Find the current client to preserve any fields not in the form
    const existingClient = this.users.find(u => u.id === this.editClientId);
    if (!existingClient) {
      this.showAlert('Client not found', 'error');
      return;
    }

    const formValues = this.clientForm.value;
    
    // Create updated client object
    const updatedClient: Client = {
      ...existingClient as Client,
      nom: formValues.nom,
      prenom: formValues.prenom,
      email: formValues.email,
      telephone: formValues.telephone,
      adresse: formValues.adresse,
      ville: formValues.ville,
      codePostal: formValues.codePostal,
      pays: formValues.pays,
      dateNaissance: new Date(formValues.dateNaissance),
      cin: formValues.cin
    };

    // Only update password if it was provided
    if (formValues.password) {
      updatedClient.password = formValues.password;
    }

    this.agentClientService.updateClient(updatedClient).subscribe(
      (client) => {
        // Update in local arrays
        const index = this.users.findIndex(u => u.id === client.id);
        if (index !== -1) {
          const displayClient = this.mapClientToUserDisplay(client);
          this.users[index] = displayClient;
          
          // Update in all users array too
          const allIndex = this.allUsers.findIndex(u => u.id === client.id);
          if (allIndex !== -1) {
            this.allUsers[allIndex] = displayClient;
          }
        }
        
        this.showAlert('Client updated successfully', 'success');
        this.isClientModalVisible = false;
      },
      (error) => {
        console.error('Error updating client:', error);
        this.showAlert('Failed to update client. Please try again.', 'error');
      }
    );
  }

  /**
   * Delete a client
   */
  deleteClient(clientId: number | undefined): void {
    if (clientId === undefined) return;
    
    if (confirm('Are you sure you want to delete this client?')) {
      this.agentClientService.deleteClient(clientId).subscribe(
        () => {
          // Remove from local arrays
          this.users = this.users.filter(user => user.id !== clientId);
          this.allUsers = this.allUsers.filter(user => user.id !== clientId);
          
          this.showAlert('Client deleted successfully', 'success');
        },
        (error) => {
          console.error('Error deleting client:', error);
          this.showAlert('Failed to delete client. Please try again.', 'error');
        }
      );
    }
  }
  /**
   * Toggle client active status
   */
  toggleUserStatus(user: UserDisplay): void {
    if (!user || user.id === undefined) return;
    
    // Determine if we need to activate or deactivate the client
    const activate = !user.estActif;
    const method = activate ? 
      this.agentClientService.activateClient(user.id) : 
      this.agentClientService.deactivateClient(user.id);
    
    method.subscribe(
      (client) => {
        // Update in local arrays
        const index = this.users.findIndex(u => u.id === client.id);
        if (index !== -1) {
          // Update the user's status
          this.users[index].estActif = client.estActif;
          this.users[index].statusClass = client.estActif 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800';
          
          // Update in all users array too
          const allIndex = this.allUsers.findIndex(u => u.id === client.id);
          if (allIndex !== -1) {
            this.allUsers[allIndex].estActif = client.estActif;
            this.allUsers[allIndex].statusClass = client.estActif 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800';
          }
        }
        
        // Close dropdown menu
        this.activeDropdownId = null;
        
        this.showAlert(`Client ${client.estActif ? 'activated' : 'deactivated'} successfully`, 'success');
      },
      (error) => {
        console.error('Error updating client status:', error);
        this.showAlert('Failed to update client status. Please try again.', 'error');
      }
    );
  }
  
  /**
   * Edit a client - opens the edit modal
   */
  editClient(client: UserDisplay): void {
    this.toggleClientModal(client);
  }
  
  /**
   * View client details
   */

  viewClientDetails(client: UserDisplay): void {
    this.selectedClient = client;
    this.isViewMode = true;
  }

  closeClientDetails(): void {
    this.selectedClient = null;
    this.isViewMode = false;
  }


  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }


  // Active dropdown ID

  // Toggle user actions dropdown
  toggleUserActions(userId: number | undefined): void {
    if (userId === undefined) return;
    this.activeDropdownId = this.activeDropdownId === userId ? null : userId;
  }

  // Toggle user active status
  

  // Modified deleteClient to handle undefined id
  

  // Alert message properties
  
  // Show alert message
  showAlert(message: string, type: 'success' | 'error' = 'success', duration: number = 5000): void {
    this.alertMessage = message;
    this.alertType = type;

    // Clear any existing timeout
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.closeAlert();
    }, duration);
  }
  
  /**
   * Close the alert message
   */
  closeAlert(): void {
    this.alertMessage = null;
  }

  // Clear search and reset users list
  clearSearch(): void {
    this.searchQuery = '';
    this.loadClients();
  }

  /**
   * Check if any filters are currently active
   */
  hasActiveFilters(): boolean {
    return Object.values(this.filters.roles).some(v => v) ||
           Object.values(this.filters.status).some(v => v) ||
           Object.values(this.filters.clientInfo).some(v => v);
  }

  /**
   * Get count of active filters
   */
  getActiveFilterCount(): number {
    let count = 0;
    // Count role filters
    if (this.filters.roles.admin) count++;
    if (this.filters.roles.manager) count++;
    if (this.filters.roles.agent) count++;
    if (this.filters.roles.user) count++;
    
    // Count status filters
    if (this.filters.status.active) count++;
    if (this.filters.status.inactive) count++;
    if (this.filters.status.flagged) count++;
    
    // Count client info filters
    if (this.filters.clientInfo.hasAccounts) count++;
    if (this.filters.clientInfo.newClient) count++;
    
    return count;
  }
}
