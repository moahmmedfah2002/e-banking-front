import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../modele/Role';
import { User } from '../../modele/User';
import { Client } from '../../modele/Client';
import { AdminUsersService } from '../../services/admin/admin-users.service';

export interface UserStats {
  totalUsers: number;
  totalIncrease: number;
  activeUsers: number;
  activeIncrease: number;
  adminsAndManagers: number;
  adminsChange: string;
  flaggedAccounts: number;
  flaggedIncrease: number;
}

export interface UserDisplay extends User, Partial<Client> {
  initials?: string;
  lastLogin?: string;
  statusClass?: string;
  roleBadgeClass?: string;
  roleIcon?: string;
  roleLabel?: string;
  numeroClient?: number;
}

export interface Filters {
  roles: {
    admin: boolean;
    manager: boolean;
    agent: boolean;
    user: boolean;
  };
  status: {
    active: boolean;
    inactive: boolean;
    flagged: boolean;
  };
  clientInfo: {
    hasAccounts: boolean;
    newClient: boolean;
  };
}

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
  host: {
    '(document:click)': 'onClickOutside($event)',
  }
})
export class AdminUsersComponent implements OnInit {  
  // User statistics
  userStats: UserStats = {
    totalUsers: 0,
    totalIncrease: 0,
    activeUsers: 0,
    activeIncrease: 0,
    adminsAndManagers: 0,
    adminsChange: '0%',
    flaggedAccounts: 0,
    flaggedIncrease: 0
  };
  
  // Users data
  users: UserDisplay[] = [];
  allUsers: UserDisplay[] = [];
  
  // Client-specific properties
  clients: Client[] = [];
  clientForm!: FormGroup;
  isClientModalVisible: boolean = false;
  selectedClient: Client | null = null;
  
  // Filter dropdown visibility
  isFilterDropdownVisible: boolean = false;
  
  // User form properties
  isUserModalVisible: boolean = false;
  userForm!: FormGroup;
  
  // User edit state
  isEditMode: boolean = false;
  editUserId: number | undefined;
  
  // User view state
  isViewMode: boolean = false;
  selectedUser: UserDisplay | null = null;
  
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

  getActiveUsersCount(): number {
    return this.users.filter(user => user.estActif).length;
  }
  
  // Sort option
  sortOption: string = 'name';
    constructor(private fb: FormBuilder, private adminUsersService: AdminUsersService) {
    this.initializeUserForm();
    this.initializeClientForm();
  }

  ngOnInit(): void {
    // Load user stats
    this.loadUserStats();
    // Load users data
    this.loadUsers();
    // Load clients data
    this.loadClients();
  }
  
  // Load user stats from service
  loadUserStats(): void {
    // Either use a service method or create mock stats
    this.userStats = {
      totalUsers: 0,
      totalIncrease: 0,
      activeUsers: 0,
      activeIncrease: 0,
      adminsAndManagers: 0,
      adminsChange: '0%',
      flaggedAccounts: 0,
      flaggedIncrease: 0
    };
    
    // If the service has a getUserStats method, you can use it:
    /* 
    this.adminUsersService.getUserStats().subscribe({
      next: (stats: UserStats) => {
        this.userStats = stats;
      },
      error: (err: any) => {
        console.error('Error loading user stats:', err);
      }
    });
    */
  }

  // Load users from service
  loadUsers(): void {
    this.adminUsersService.getUsers().subscribe({
      next: (users) => {
        // Transform users to UserDisplay format
        this.users = users.map(user => this.transformToUserDisplay(user));
        this.allUsers = [...this.users];
      },
      error: (err) => {
        console.error('Error loading users:', err);
        // Fallback to mock data if API fails
        this.initializeMockData();
        this.allUsers = [...this.users];
      }
    });
  }
  // Load clients from service
  loadClients(): void {
    this.adminUsersService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        // Update users with client data
        this.users = clients.map(client => this.transformClientToUserDisplay(client));
        this.allUsers = [...this.users];
        
        // Update userStats with client data
        this.userStats = {
          totalUsers: this.users.length,
          totalIncrease: 0,
          activeUsers: this.users.filter(u => u.estActif).length,
          activeIncrease: 0,
          adminsAndManagers: 0,
          adminsChange: 'N/A',
          flaggedAccounts: this.users.filter(u => !u.estActif).length,
          flaggedIncrease: 0
        };
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.showAlert('Failed to load client data. Using local data instead.', 'error');
        // Fallback to mock data if API fails
        this.initializeMockData();
        this.allUsers = [...this.users];
      }
    });
  }
  
  // Transform User to UserDisplay
  private transformToUserDisplay(user: User): UserDisplay {
    const initials = `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`;
    let roleLabel = 'User';
    let roleIcon = 'fas fa-user';
    let roleBadgeClass = 'role-badge-user';
    
    // Determine role display properties based on the role
    if (user.role === Role.ADMIN) {
      roleLabel = 'Admin';
      roleIcon = 'fas fa-user-shield';
      roleBadgeClass = 'role-badge-admin';
    } else if (user.role === Role.AGENT) {
      roleLabel = 'Agent';
      roleIcon = 'fas fa-user-tie';
      roleBadgeClass = 'role-badge-agent';
    }
    
    return {
      ...user,
      initials: initials,
      lastLogin: this.getRandomLastLogin(),
      statusClass: user.estActif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
      roleBadgeClass: roleBadgeClass,
      roleIcon: roleIcon,
      roleLabel: roleLabel
    };
  }
  
  // Transform Client to UserDisplay for UI
  private transformClientToUserDisplay(client: Client): UserDisplay {
    const initials = `${client.prenom?.[0] || ''}${client.nom?.[0] || ''}`;
    
    return {
      ...client,
      initials: initials,
      lastLogin: this.getRandomLastLogin(),
      statusClass: client.estActif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
      roleBadgeClass: 'role-badge-user',
      roleIcon: 'fas fa-user',
      roleLabel: 'Client'
    };
  }

  // Get client by ID and transform to UserDisplay
  getClientDisplayById(id: number): UserDisplay | undefined {
    const client = this.clients.find(c => c.id === id);
    if (client) {
      return this.transformClientToUserDisplay(client);
    }
    return undefined;
  }
  
  // Generate random last login time for demo purposes
  private getRandomLastLogin(): string {
    const options = ['Today, 10:45 AM', 'Yesterday, 2:45 PM', '3 days ago', '1 week ago', '2 weeks ago'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private initializeUserForm(): void {
    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [Role.CLIENT, Validators.required], // Default to client role
      // Client-specific fields can be conditionally required based on role
      adresse: [''],
      ville: [''],
      codePostal: [''],
      pays: [''],
      dateNaissance: [''],
      cin: ['']
    });
  }  private initializeClientForm(): void {
    this.clientForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // Client-specific fields
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      pays: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      cin: ['', Validators.required]
    });
  }
  private initializeMockData(): void {
    this.users = [
      // Admin user
      {
        id: 1,
        nom: 'Williams',
        prenom: 'Emily',
        email: 'emily.admin@example.com',
        telephone: '+1 (555) 123-4567',
        role: Role.ADMIN,
        estActif: true,
        dateCreation: new Date('2023-05-18'),
        initials: 'EW',
        lastLogin: 'Today, 10:45 AM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-admin',
        roleIcon: 'fas fa-user-shield',
        roleLabel: 'Admin'
      },
      // Agent user
      {
        id: 2,
        nom: 'Brown',
        prenom: 'Michael',
        email: 'michael.agent@example.com',
        telephone: '+1 (555) 987-6543',
        role: Role.AGENT,
        estActif: true,
        dateCreation: new Date('2023-06-05'),
        initials: 'MB',
        lastLogin: 'Yesterday, 2:45 PM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-agent',
        roleIcon: 'fas fa-user-tie',
        roleLabel: 'Agent'
      },
      // Client users
      {
        id: 3,
        nom: 'Smith',
        prenom: 'Jessica',
        email: 'jessica.smith@example.com',
        telephone: '+1 (555) 456-7890',
        role: Role.CLIENT,
        estActif: true,
        dateCreation: new Date('2023-07-12'),
        initials: 'JS',
        lastLogin: '3 days ago',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-user',
        roleIcon: 'fas fa-user',
        roleLabel: 'Client',
        numeroClient: 1003,
        adresse: '789 Maple St',
        ville: 'Chicago',
        codePostal: '60601',
        pays: 'USA',
        dateNaissance: new Date('1992-03-18'),
        cin: 'EF345678',
        comptes: []
      },
      {
        id: 4,
        nom: 'Johnson',
        prenom: 'David',
        email: 'david.johnson@example.com',
        telephone: '+1 (555) 321-0987',
        role: Role.CLIENT,
        estActif: false,
        dateCreation: new Date('2023-08-20'),
        initials: 'DJ',
        lastLogin: '2 weeks ago',
        statusClass: 'bg-gray-100 text-gray-800',
        roleBadgeClass: 'role-badge-user',
        roleIcon: 'fas fa-user',
        roleLabel: 'Client',
        numeroClient: 1004,
        adresse: '101 Pine Blvd',
        ville: 'Miami',
        codePostal: '33101',
        pays: 'USA',
        dateNaissance: new Date('1988-07-30'),
        cin: 'GH901234',
        comptes: []
      },
      {
        id: 5,
        nom: 'Taylor',
        prenom: 'Sarah',
        email: 'sarah.taylor@example.com',
        telephone: '+1 (555) 222-3333',
        role: Role.CLIENT,
        estActif: true,
        dateCreation: new Date('2023-09-05'),
        initials: 'ST',
        lastLogin: '1 week ago',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-user',
        roleIcon: 'fas fa-user',
        roleLabel: 'Client'
      }
    ];
    
    // Update user stats based on mock data
    this.userStats = {
      totalUsers: this.users.length,
      totalIncrease: 12,
      activeUsers: this.users.filter(u => u.estActif).length,
      activeIncrease: 8,
      adminsAndManagers: this.users.filter(u => u.role === Role.ADMIN).length,
      adminsChange: '+5%',
      flaggedAccounts: this.users.filter(u => !u.estActif).length,
      flaggedIncrease: 2
    };
  }
    toggleFilterDropdown(): void {
    this.isFilterDropdownVisible = !this.isFilterDropdownVisible;
  }
  
  // Enhanced search input handler
  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      // If search is empty, reset to all users
      this.users = [...this.allUsers];
    } else {
      // Filter users by name, email, phone, or CIN with improved search
      const query = this.searchQuery.toLowerCase().trim();
      this.users = this.allUsers.filter(user => 
        // Search by full name
        `${user.prenom} ${user.nom}`.toLowerCase().includes(query) || 
        // Search by first name only
        user.prenom?.toLowerCase().includes(query) ||
        // Search by last name only
        user.nom?.toLowerCase().includes(query) ||
        // Search by email
        user.email?.toLowerCase().includes(query) ||
        // Search by phone number
        user.telephone?.toLowerCase().includes(query) ||
        // Search by CIN (ID number) for clients
        (user.cin && user.cin.toLowerCase().includes(query)) ||
        // Search by client number for clients
        (user.numeroClient && user.numeroClient.toString().includes(query))
      );
    }
    // Apply any existing sort after filtering
    this.applySorting(this.users);
    
    // Show feedback if no results found
    if (this.searchQuery.trim() && this.users.length === 0) {
      this.showAlert(`No users found matching "${this.searchQuery}"`, 'error', 3000);
    }
  }
  
  applyFilters(): void {
    let filteredUsers = [...this.allUsers];
    
    // Apply role filters if any are selected
    const roleFilters = Object.values(this.filters.roles).some(val => val);
    if (roleFilters) {
      filteredUsers = filteredUsers.filter(user => {
        if (this.filters.roles.admin && user.role === Role.ADMIN) return true;
        if (this.filters.roles.agent && user.role === Role.AGENT) return true;
        if (this.filters.roles.user && user.role === Role.CLIENT) return true;
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
        // This is a simplified implementation
        if (this.filters.status.flagged && user.statusClass?.includes('red')) return true;
        return false;
      });
    }
    
    // Apply sorting
    this.applySorting(filteredUsers);
    
    this.users = filteredUsers;
  }
  
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
        // This is a simplified implementation since lastLogin is just a string
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
    onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortOption = target.value;
    this.applySorting(this.users);
  }
  
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
  }
  
  // Toggle user modal visibility
  toggleUserModal(): void {
    this.isUserModalVisible = !this.isUserModalVisible;
    if (!this.isUserModalVisible) {
      this.resetUserForm();
      this.isEditMode = false;
      this.editUserId = undefined;
    } else if (!this.isEditMode) {
      // Reset validators for password - required in create mode
      this.userForm.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.controls['password'].updateValueAndValidity();
      // Reset form if not in edit mode
      this.resetUserForm();
    }
  }
  
  // Reset form when closing modal
  resetUserForm(): void {
    this.userForm.reset();
    // Set default role
    this.userForm.patchValue({
      role: Role.CLIENT
    });
  }
    // Handle user form submission
  onUserSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
    
    const formValues = this.userForm.value;
    const selectedRole = formValues.role;
    
    if (this.isEditMode && this.editUserId) {
      // Update existing user
      const userIndex = this.users.findIndex(u => u.id === this.editUserId);
      
      if (userIndex !== -1) {
        // Create updated user object based on role
        const updatedUser: any = {
          ...this.users[userIndex],
          nom: formValues.nom,
          prenom: formValues.prenom,
          email: formValues.email,
          telephone: formValues.telephone,
          role: selectedRole
        };
        
        // Add client-specific fields if the user is a client
        if (selectedRole === Role.CLIENT) {
          updatedUser.adresse = formValues.adresse;
          updatedUser.ville = formValues.ville;
          updatedUser.codePostal = formValues.codePostal;
          updatedUser.pays = formValues.pays;
          updatedUser.dateNaissance = new Date(formValues.dateNaissance);
          updatedUser.cin = formValues.cin;
          updatedUser.numeroClient = this.users[userIndex].numeroClient ?? 0;
          updatedUser.comptes = this.users[userIndex].comptes || [];
        }
        
        // Update via service
        this.adminUsersService.updateUser(updatedUser).subscribe({
          next: (updatedUser) => {
            // Determine role display properties based on the role
            let roleLabel = 'User';
            let roleIcon = 'fas fa-user';
            let roleBadgeClass = 'role-badge-user';
            
            if (updatedUser.role === Role.ADMIN) {
              roleLabel = 'Admin';
              roleIcon = 'fas fa-user-shield';
              roleBadgeClass = 'role-badge-admin';
            } else if (updatedUser.role === Role.AGENT) {
              roleLabel = 'Agent';
              roleIcon = 'fas fa-user-tie';
              roleBadgeClass = 'role-badge-agent';
            } else if (updatedUser.role === Role.CLIENT) {
              roleLabel = 'Client';
            }
            
            // Update local UI data
            this.users[userIndex] = {
              ...updatedUser,
              initials: `${formValues.prenom[0]}${formValues.nom[0]}`,
              lastLogin: this.users[userIndex].lastLogin,
              statusClass: updatedUser.estActif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
              roleBadgeClass: roleBadgeClass,
              roleIcon: roleIcon,
              roleLabel: roleLabel
            };
            
            // Update the allUsers array
            this.allUsers = [...this.users];
            
            console.log('User updated successfully:', this.users[userIndex]);
            this.showAlert('User updated successfully', 'success');
          },
          error: (err) => {
            console.error('Failed to update user:', err);
            this.showAlert('Failed to update user', 'error');
          }
        });
      }
    } else {
      // Create new user base object
      const newUser: any = {
        id: 0, // This will be set by the service
        nom: formValues.nom,
        prenom: formValues.prenom,
        email: formValues.email,
        telephone: formValues.telephone,
        identifiant: `${formValues.prenom.toLowerCase()[0]}${formValues.nom.toLowerCase()}`,
        password: formValues.password,
        role: selectedRole,
        estActif: true,
        dateCreation: new Date()
      };
      
      // Add client-specific fields if the user is a client
      if (selectedRole === Role.CLIENT) {
        newUser.adresse = formValues.adresse;
        newUser.ville = formValues.ville;
        newUser.codePostal = formValues.codePostal;
        newUser.pays = formValues.pays;
        newUser.dateNaissance = formValues.dateNaissance ? new Date(formValues.dateNaissance) : null;
        newUser.cin = formValues.cin;
        newUser.numeroClient = 0; // This will be set by the service
        newUser.comptes = [];
      }
      
      // Add user via service
      this.adminUsersService.createUser(newUser).subscribe({
        next: (savedUser) => {
          // Determine role display properties based on the role
          let roleLabel = 'User';
          let roleIcon = 'fas fa-user';
          let roleBadgeClass = 'role-badge-user';
          
          if (savedUser.role === Role.ADMIN) {
            roleLabel = 'Admin';
            roleIcon = 'fas fa-user-shield';
            roleBadgeClass = 'role-badge-admin';
          } else if (savedUser.role === Role.AGENT) {
            roleLabel = 'Agent';
            roleIcon = 'fas fa-user-tie';
            roleBadgeClass = 'role-badge-agent';
          } else if (savedUser.role === Role.CLIENT) {
            roleLabel = 'Client';
          }
          
          // Add new user to the users array for UI
          const newUserDisplay: UserDisplay = {
            ...savedUser,
            initials: `${formValues.prenom[0]}${formValues.nom[0]}`,
            lastLogin: 'Just now',
            statusClass: 'bg-green-100 text-green-800',
            roleBadgeClass: roleBadgeClass,
            roleIcon: roleIcon,
            roleLabel: roleLabel
          };
          
          // Add to local data for UI
          this.users.unshift(newUserDisplay);
          this.allUsers = [...this.users];
          
          console.log('User created successfully:', newUserDisplay);
          this.showAlert('User created successfully', 'success');
        },
        error: (err) => {
          console.error('Failed to create user:', err);
          this.showAlert('Failed to create user', 'error');
        }
      });
    }
    
    // Close modal and reset form
    this.toggleUserModal();
  }
  
  // Edit user
  editUser(user: UserDisplay): void {
    this.isEditMode = true;
    this.editUserId = user.id;
    
    // Update form validation for password - not required in edit mode
    this.userForm.controls['password'].clearValidators();
    this.userForm.controls['password'].updateValueAndValidity();
    
    // Populate the form with the user's data
    this.userForm.patchValue({
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
      // Client-specific fields if available
      adresse: user.adresse,
      ville: user.ville,
      codePostal: user.codePostal,
      pays: user.pays,
      dateNaissance: user.dateNaissance ? this.formatDateForInput(user.dateNaissance) : '',
      cin: user.cin
    });
    
    // Show the modal
    this.isUserModalVisible = true;
  }
  
  // View user details
  viewUserDetails(user: UserDisplay): void {
    this.selectedUser = user;
    this.isViewMode = true;
  }
  
  // Close user details view
  closeUserDetails(): void {
    this.selectedUser = null;
    this.isViewMode = false;
  }
  
  // Format a date for the input[type="date"] field (YYYY-MM-DD)
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
  activeDropdownId: number | null = null;
  
  // Toggle user actions dropdown
  toggleUserActions(userId: number | undefined): void {
    if (userId === undefined) return;
    this.activeDropdownId = this.activeDropdownId === userId ? null : userId;
  }
  
  // Toggle user active status
  toggleUserStatus(user: UserDisplay): void {
    if (user) {
      user.estActif = !user.estActif;
      user.statusClass = user.estActif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
      
      // Close dropdown menu
      this.activeDropdownId = null;
      
      console.log(`User ${user.prenom} ${user.nom} is now ${user.estActif ? 'active' : 'inactive'}`);
      this.showAlert(`User ${user.prenom} ${user.nom} is now ${user.estActif ? 'active' : 'inactive'}`, 'success');
    }
  }
    // Delete user
  deleteUser(userId: number | undefined): void {
    if (userId === undefined) return;
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminUsersService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.allUsers = [...this.users];
          console.log('User deleted successfully');
          this.showAlert('User deleted successfully', 'success');
        },
        error: (err) => {
          console.error('Failed to delete user:', err);
          this.showAlert('Failed to delete user', 'error');
        }
      });
    }
  }
    // Delete client
  deleteClient(userId: number): void {
    if (userId === undefined) return;
    
    if (confirm('Are you sure you want to delete this client?')) {
      // Find client name for better feedback
      const client = this.users.find(user => user.id === userId);
      const clientName = client ? `${client.prenom} ${client.nom}` : `ID: ${userId}`;
      
      this.adminUsersService.deleteClient(userId).subscribe({
        next: () => {
          // Remove client from arrays
          this.clients = this.clients.filter(client => client.id !== userId);
          this.users = this.users.filter(user => user.id !== userId);
          this.allUsers = [...this.users];
          
          console.log(`Client ${clientName} deleted successfully`);
          this.showAlert(`Client ${clientName} deleted successfully`, 'success');
          
          // Close the detail view if it's open for the deleted client
          if (this.selectedClient && this.selectedClient.id === userId) {
            this.closeClientDetails();
          }
          
          // Update stats after deletion
          this.userStats.totalUsers = this.users.length;
          this.userStats.activeUsers = this.users.filter(u => u.estActif).length;
          this.userStats.flaggedAccounts = this.users.filter(u => !u.estActif).length;
        },
        error: (err) => {
          console.error('Failed to delete client:', err);
          let errorMessage = 'Failed to delete client';
          
          // Extract more specific error message if available
          if (err.error && typeof err.error === 'string') {
            errorMessage += `: ${err.error}`;
          } else if (err.message) {
            errorMessage += `: ${err.message}`;
          } else if (err.status === 403) {
            errorMessage = 'You do not have permission to delete this client';
          } else if (err.status === 404) {
            errorMessage = 'Client not found or already deleted';
          }
          
          this.showAlert(errorMessage, 'error');
        }
      });
    }
  }
  
  // Alert message properties
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  alertTimeout: any;
    // Show alert message
  showAlert(message: string, type: 'success' | 'error' = 'success', duration: number = 5000): void {
    this.alertMessage = message;
    this.alertType = type;
    
    // Clear any existing timeout
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    
    // Auto-hide the alert after the specified duration
    this.alertTimeout = setTimeout(() => {
      this.closeAlert();
    }, duration);
  }
  // Close alert message
  closeAlert(): void {
    this.alertMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
      this.alertTimeout = undefined;
    }
  }
  
  // Clear search and reset users list
  clearSearch(): void {
    this.searchQuery = '';
    this.users = [...this.allUsers];
    this.applySorting(this.users);
  }
  
  // Toggle client modal visibility
  toggleClientModal(): void {
    this.isClientModalVisible = !this.isClientModalVisible;
    if (!this.isClientModalVisible) {
      this.resetClientForm();
      this.isEditMode = false;
      this.editUserId = undefined;
    } else if (!this.isEditMode) {
      // Reset validators for password - required in create mode
      this.clientForm.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
      this.clientForm.controls['password'].updateValueAndValidity();
      // Reset form if not in edit mode
      this.resetClientForm();
    }
  }
  
  // Reset client form
  resetClientForm(): void {
    this.clientForm.reset();
  }
  
  // Handle client form submission
  onClientSubmit(): void {
    if (this.clientForm.invalid) {
      return;
    }
    
    const formValues = this.clientForm.value;
    
    if (this.isEditMode && this.editUserId) {
      // Update existing client
      const clientIndex = this.clients.findIndex(c => c.id === this.editUserId);
      
      if (clientIndex !== -1) {
        // Create updated client object
        const updatedClient: Client = {
          ...this.clients[clientIndex],
          nom: formValues.nom,
          prenom: formValues.prenom,
          email: formValues.email,
          telephone: formValues.telephone,
          role: Role.CLIENT,
          adresse: formValues.adresse,
          ville: formValues.ville,
          codePostal: formValues.codePostal,
          pays: formValues.pays,
          dateNaissance: new Date(formValues.dateNaissance),
          cin: formValues.cin
        };
        
        // Update via service
        this.adminUsersService.updateClient(updatedClient).subscribe({
          next: (updatedClient) => {
            // Update local UI data
            const userDisplay = this.transformToUserDisplay(updatedClient);
            const userIndex = this.users.findIndex(u => u.id === updatedClient.id);
            if (userIndex !== -1) {
              this.users[userIndex] = userDisplay;
            }
            
            // Update the clients array
            this.clients[clientIndex] = updatedClient;
            
            // Update the allUsers array
            this.allUsers = [...this.users];
            
            console.log('Client updated successfully:', updatedClient);
            this.showAlert('Client updated successfully', 'success');
          },          error: (err) => {
            console.error('Failed to update client:', err);
            
            let errorMessage = 'Failed to update client';
            // Extract more specific error message if available
            if (err.error && err.error.message) {
              errorMessage += `: ${err.error.message}`;
            } else if (err.error && typeof err.error === 'string') {
              errorMessage += `: ${err.error}`;
            } else if (err.status === 400) {
              errorMessage += ': Please check that all fields are valid';
            } else if (err.status === 404) {
              errorMessage += ': Client not found';
            }
            
            this.showAlert(errorMessage, 'error');
            
            // Keep the modal open so the user can fix the form
            this.isClientModalVisible = true;
          }
        });
      }
    } else {
      // Create new client
      const newClient: Client = {
        id: 0, // This will be set by the service
        nom: formValues.nom,
        prenom: formValues.prenom,
        email: formValues.email,
        telephone: formValues.telephone,
        identifiant: `${formValues.prenom.toLowerCase()[0]}${formValues.nom.toLowerCase()}`,
        password: formValues.password,
        role: Role.CLIENT,
        estActif: true,
        dateCreation: new Date(),
        adresse: formValues.adresse,
        ville: formValues.ville,
        codePostal: formValues.codePostal,
        pays: formValues.pays,
        dateNaissance: formValues.dateNaissance ? new Date(formValues.dateNaissance) : new Date(),
        cin: formValues.cin,
        numeroClient: 0, // This will be set by the service
        comptes: []
      };
      
      // Add client via service
      this.adminUsersService.createClient(newClient).subscribe({
        next: (savedClient) => {
          // Create user display object
          const newUserDisplay = this.transformToUserDisplay(savedClient);
          
          // Add to clients array
          this.clients.push(savedClient);
          
          // Add to users array for UI
          this.users.unshift(newUserDisplay);
          this.allUsers = [...this.users];
          
          console.log('Client created successfully:', savedClient);
          this.showAlert('Client created successfully', 'success');
        },          error: (err) => {
            console.error('Failed to create client:', err);
            
            let errorMessage = 'Failed to create client';
            // Extract more specific error message if available
            if (err.error && err.error.message) {
              errorMessage += `: ${err.error.message}`;
            } else if (err.error && typeof err.error === 'string') {
              errorMessage += `: ${err.error}`;
            } else if (err.status === 400) {
              errorMessage += ': Please check that all fields are valid';
            } else if (err.status === 409) {
              errorMessage += ': A client with this email or identity number already exists';
            }
            
            this.showAlert(errorMessage, 'error');
            
            // Keep the modal open so the user can fix the form
            this.isClientModalVisible = true;
          }
      });
    }
    
    // Close modal and reset form
    this.toggleClientModal();
  }
    // Edit client
  editClient(user: UserDisplay): void {
    const client = this.clients.find(c => c.id === user.id);
    if (!client) return;
    
    this.isEditMode = true;
    this.editUserId = client.id;
    
    // Update form validation for password - not required in edit mode
    this.clientForm.controls['password'].clearValidators();
    this.clientForm.controls['password'].updateValueAndValidity();
    
    // Populate the form with the client's data
    this.clientForm.patchValue({
      prenom: client.prenom,
      nom: client.nom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
      ville: client.ville,
      codePostal: client.codePostal,
      pays: client.pays,
      dateNaissance: client.dateNaissance ? this.formatDateForInput(client.dateNaissance) : '',
      cin: client.cin
    });
    
    // Show the modal
    this.isClientModalVisible = true;
  }
  // View client details
  viewClientDetails(user: UserDisplay): void {
    const client = this.clients.find(c => c.id === user.id);
    if (client) {
      this.selectedClient = client;
      this.selectedUser = user;
      this.isViewMode = true;
      
      // Ensure we're getting the most up-to-date client data from the API
      this.adminUsersService.getClientById(user.id || 0).subscribe({
        next: (updatedClient) => {
          if (updatedClient && updatedClient.id) {
            this.selectedClient = updatedClient;
            
            // Update the users array with fresh data if needed
            const userIndex = this.users.findIndex(u => u.id === updatedClient.id);
            if (userIndex !== -1) {
              // Keep UI-specific properties from the existing user but update the core data
              this.users[userIndex] = {
                ...this.users[userIndex],
                ...updatedClient
              };
              
              // Update selectedUser to reflect changes
              this.selectedUser = this.users[userIndex];
            }
          }
        },
        error: (err) => {
          console.error('Failed to fetch updated client details:', err);
          // We'll continue with the data we have even if this fails
        }
      });
    }
  }
  
  // Close client details view
  closeClientDetails(): void {
    this.selectedClient = null;
    this.selectedUser = null;
    this.isViewMode = false;
  }
}
