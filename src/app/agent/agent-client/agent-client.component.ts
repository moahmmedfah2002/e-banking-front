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
    this.loadClientStats();
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
   */
  loadClients(): void {
    this.agentClientService.getClients().subscribe(
      (clients) => {
        // Map API clients to UserDisplay format
        this.users = clients.map(client => this.mapClientToUserDisplay(client));
        this.allUsers = [...this.users];
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
  loadClientStats(): void {
    this.agentClientService.getClientStats().subscribe(
      (stats) => {
        this.userStats = {
          totalUsers: stats.totalClients,
          totalIncrease: 0, // You might calculate this if you have historical data
          activeUsers: stats.activeClients,
          activeIncrease: 0,
          adminsAndManagers: 0,
          adminsChange: 'N/A',
          flaggedAccounts: stats.inactiveClients,
          flaggedIncrease: 0
        };
      },
      (error) => {
        console.error('Error loading client stats:', error);
      }
    );
  }

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
   */
  searchClients(): void {
    if (!this.searchQuery.trim()) {
      // If search is empty, load all clients
      this.loadClients();
      return;
    }
    
    this.agentClientService.searchClients(this.searchQuery).subscribe(
      (clients) => {
        this.users = clients.map(client => this.mapClientToUserDisplay(client));
        this.applySorting(this.users);
        
        // Show feedback if no results found
        if (this.users.length === 0) {
          this.showAlert(`No clients found matching "${this.searchQuery}"`, 'error', 3000);
        }
      },
      (error) => {
        console.error('Error searching clients:', error);
        this.showAlert('Failed to search clients. Please try again.', 'error');
      }
    );
  }
  
  /**
   * Apply filters to the client list
   */

  applyFilters(): void {
    let filteredUsers = [...this.allUsers];

    // Apply role filters if any are selected
    const roleFilters = Object.values(true).some(val => val);
    if (roleFilters) {
      filteredUsers = filteredUsers.filter(user => {
        // Only client role is relevant
        if (true) return true;
        return false;
      });
    }

    // Apply status filters if any are selected
    const statusFilters = Object.values(this.filters.status).some(val => val);
    if (statusFilters) {
      filteredUsers = filteredUsers.filter(user => {
        if (this.filters.status.active && user.estActif) return true;
        if (this.filters.status.inactive && !user.estActif) return true;
        // For flagged users, could add a 'flagged' property or use another approach
        if (this.filters.status.flagged && user.statusClass?.includes('red')) return true;
        return false;
      });
    }

    // Apply sorting
    this.applySorting(filteredUsers);

    this.users = filteredUsers;
  }

  
  /**
   * Clear all filters
   */



  clearFilters(): void {
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

    this.users = [...this.allUsers];
    this.applySorting(this.users);
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
          if (!a.dateCreation || !b.dateCreation) return 0;
          return b.dateCreation.getTime() - a.dateCreation.getTime();
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
        this.loadClientStats(); // Refresh stats
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
          this.loadClientStats(); // Refresh stats
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
        this.loadClientStats(); // Refresh stats
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
}
