import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../modele/Role';
import { User } from '../../modele/User';
import { Client } from '../../modele/Client';

interface UserStats {
  totalUsers: number;
  totalIncrease: number;
  activeUsers: number;
  activeIncrease: number;
  adminsAndManagers: number;
  adminsChange: string;
  flaggedAccounts: number;
  flaggedIncrease: number;
}

interface UserDisplay extends User, Partial<Client> {
  initials?: string;
  lastLogin?: string;
  statusClass?: string;
  roleBadgeClass?: string;
  roleIcon?: string;
  roleLabel?: string;
  numeroClient?: number;
}

interface Filters {
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
export class AdminUsersComponent implements OnInit {  // Client statistics
  userStats: UserStats = {
    totalUsers: 18249,
    totalIncrease: 8,
    activeUsers: 16420,
    activeIncrease: 5,
    adminsAndManagers: 0,
    adminsChange: 'N/A',
    flaggedAccounts: 23,
    flaggedIncrease: 15
  };
  // Mock users data
  users: UserDisplay[] = [];
  allUsers: UserDisplay[] = [];
  
  // Filter dropdown visibility
  isFilterDropdownVisible: boolean = false;
  
  // Client form properties
  isClientModalVisible: boolean = false;
  clientForm!: FormGroup;
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
  constructor(private fb: FormBuilder) {
    this.initializeClientForm();
  }

  ngOnInit(): void {
    // Initialize mock data
    this.initializeMockData();
    this.allUsers = [...this.users];
  }
  
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
  }  private initializeMockData(): void {
    this.users = [
      {
        id: 1,
        nom: 'Williams',
        prenom: 'Emily',
        email: 'emily.williams@example.com',
        telephone: '+1 (555) 123-4567',
        role: Role.CLIENT,
        estActif: true,
        dateCreation: new Date('2023-05-18'),
        initials: 'EW',
        lastLogin: 'Today, 10:45 AM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-user',
        roleIcon: 'fas fa-user',
        roleLabel: 'Client',
        numeroClient: 1001,
        adresse: '123 Main St',
        ville: 'New York',
        codePostal: '10001',
        pays: 'USA',
        dateNaissance: new Date('1990-05-15'),
        cin: 'AB123456',        comptes: []
      },
      {
        id: 2,
        nom: 'Brown',
        prenom: 'Michael',
        email: 'michael.brown@example.com',
        telephone: '+1 (555) 987-6543',
        role: Role.CLIENT,
        estActif: true,
        dateCreation: new Date('2023-06-05'),
        initials: 'MB',
        lastLogin: 'Yesterday, 2:45 PM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-user',
        roleIcon: 'fas fa-user',
        roleLabel: 'Client',
        numeroClient: 1002,
        adresse: '456 Oak Ave',
        ville: 'Los Angeles',
        codePostal: '90001',
        pays: 'USA',
        dateNaissance: new Date('1985-10-22'),
        cin: 'CD789012',
        comptes: []
      },
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
        id: 4,
        nom: 'Williams',
        prenom: 'Emily',
        email: 'emily.williams@example.com',
        role: Role.CLIENT,
        estActif: false,
        dateCreation: new Date('2023-05-18'),
        initials: 'EW',
        lastLogin: '2 weeks ago',
        statusClass: 'bg-gray-100 text-gray-800',
        roleBadgeClass: 'role-badge-user',
        roleIcon: 'fas fa-user',
        roleLabel: 'User'
      },
      {
        id: 5,
        nom: 'Brown',
        prenom: 'Michael',
        email: 'michael.brown@example.com',
        role: Role.CLIENT,
        estActif: true,
        dateCreation: new Date('2023-06-05'),
        initials: 'MB',
        lastLogin: 'Yesterday, 2:45 PM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-user',
        roleIcon: 'fas fa-user',
        roleLabel: 'User'
      }
    ];
  }
  
  toggleFilterDropdown(): void {
    this.isFilterDropdownVisible = !this.isFilterDropdownVisible;
  }
    applyFilters(): void {
    let filteredUsers = [...this.allUsers];
    
    // Apply role filters if any are selected
    const roleFilters = Object.values(this.filters.roles).some(val => val);
    if (roleFilters) {
      filteredUsers = filteredUsers.filter(user => {
        // Only client role is relevant
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
    const filterDropdownBtn = document.querySelector('#filter-dropdown-btn') as HTMLElement;
    const filterDropdown = document.querySelector('.filter-dropdown') as HTMLElement;
    
    // Check if the click was outside both the button and the dropdown
    if (filterDropdownBtn && filterDropdown && 
        !filterDropdownBtn.contains(event.target as Node) && 
        !filterDropdown.contains(event.target as Node)) {
      this.isFilterDropdownVisible = false;
    }
  }
  
  // Toggle client modal visibility
  toggleClientModal(): void {
    this.isClientModalVisible = !this.isClientModalVisible;
    if (!this.isClientModalVisible) {
      this.resetClientForm();
    }
  }
  
  // Reset form when closing modal
  resetClientForm(): void {
    this.clientForm.reset();
  }
    // Handle client form submission
  onClientSubmit(): void {
    if (this.clientForm.invalid) {
      return;
    }
    
    const formValues = this.clientForm.value;
    const newId = Math.max(...this.users.map(user => user.id || 0)) + 1;
    
    // Create new client
    const newClient: UserDisplay = {
      id: newId,
      nom: formValues.nom,
      prenom: formValues.prenom,
      email: formValues.email,
      telephone: formValues.telephone,
      identifiant: `${formValues.prenom.toLowerCase()[0]}${formValues.nom.toLowerCase()}`,
      password: formValues.password,
      role: Role.CLIENT,
      estActif: true,
      dateCreation: new Date(),
      initials: `${formValues.prenom[0]}${formValues.nom[0]}`,
      lastLogin: 'Just now',
      statusClass: 'bg-green-100 text-green-800',
      roleBadgeClass: 'role-badge-user',
      roleIcon: 'fas fa-user',
      roleLabel: 'Client',
      // Client specific properties
      numeroClient: newId + 1000,
      adresse: formValues.adresse,
      ville: formValues.ville,
      codePostal: formValues.codePostal,
      pays: formValues.pays,
      dateNaissance: new Date(formValues.dateNaissance),
      cin: formValues.cin,
      comptes: []
    };
    
    // Add new client to the users array
    this.users.unshift(newClient);
    this.allUsers = [...this.users];
    
    // Close modal and reset form
    this.toggleClientModal();
    
    // Show success message (could be implemented with a toast service)
    console.log('Client created successfully:', newClient);
  }
}
