import { Component, OnInit } from '@angular/core';
import { Role } from '../../modele/Role';
import { User } from '../../modele/User';

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

interface UserDisplay extends User {
  initials?: string;
  lastLogin?: string;
  statusClass?: string;
  roleBadgeClass?: string;
  roleIcon?: string;
  roleLabel?: string;
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
    totalUsers: 24521,
    totalIncrease: 12,
    activeUsers: 18249,
    activeIncrease: 8,
    adminsAndManagers: 245,
    adminsChange: 'No change',
    flaggedAccounts: 23,
    flaggedIncrease: 15
  };

  // Mock users data
  users: UserDisplay[] = [];
  allUsers: UserDisplay[] = [];
  
  // Filter dropdown visibility
  isFilterDropdownVisible: boolean = false;
  
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
    }
  };

  getActiveUsersCount(): number {
    return this.users.filter(user => user.estActif).length;
  }
  // Sort option
  sortOption: string = 'name';

  constructor() { }

  ngOnInit(): void {
    // Initialize mock data
    this.initializeMockData();
    this.allUsers = [...this.users];
  }
  private initializeMockData(): void {
    this.users = [
      {
        id: 1,
        nom: 'Doe',
        prenom: 'John',
        email: 'john.doe@example.com',
        role: Role.ADMIN,
        estActif: true,
        dateCreation: new Date('2023-01-15'),
        initials: 'JD',
        lastLogin: 'Today, 10:45 AM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-admin',
        roleIcon: 'fas fa-user-shield',
        roleLabel: 'Admin'
      },
      {
        id: 2,
        nom: 'Miller',
        prenom: 'Sarah',
        email: 'sarah.miller@example.com',
        role: Role.AGENT,
        estActif: true,
        dateCreation: new Date('2023-03-22'),
        initials: 'SM',
        lastLogin: 'Today, 09:32 AM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-manager',
        roleIcon: 'fas fa-user-tie',
        roleLabel: 'Manager'
      },
      {
        id: 3,
        nom: 'Johnson',
        prenom: 'Robert',
        email: 'robert.johnson@example.com',
        role: Role.AGENT,
        estActif: true,
        dateCreation: new Date('2023-04-10'),
        initials: 'RJ',
        lastLogin: 'Yesterday, 4:23 PM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-agent',
        roleIcon: 'fas fa-headset',
        roleLabel: 'Agent'
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
        if (this.filters.roles.admin && user.role === Role.ADMIN) return true;
        if (this.filters.roles.manager && user.roleLabel === 'Manager') return true;
        if (this.filters.roles.agent && user.role === Role.AGENT && user.roleLabel === 'Agent') return true;
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
}
