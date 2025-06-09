import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../modele/Role';
import { User } from '../../modele/User';
import { AdminSubAdminService } from '../../services/admin/admin-sub-admin.service';

// Using local interface instead of imported one to avoid conflicts
interface AdminStats {
  totalAdmins: number;
  totalIncrease: number;
  activeAdmins: number;
  activeIncrease: number;
  superAdmins: number;
  superAdminsChange: string;
  inactiveAccounts: number;
  inactiveIncrease: number;
}

interface AdminDisplay extends User {
  roleLabel?: string;
  initials?: string;
  lastLogin?: string;
  statusClass?: string;
  roleBadgeClass?: string;
  roleIcon?: string;
}

interface Filters {
  roles: {
    superAdmin: boolean;
    admin: boolean;
  };
  status: {
    active: boolean;
    inactive: boolean;
  };
}

@Component({
  selector: 'app-admin-sub-admin',
  standalone: false,
  templateUrl: './admin-sub-admin.component.html',
  styleUrl: './admin-sub-admin.component.css',
  host: {
    '(document:click)': 'onClickOutside($event)',
  }
})
export class AdminSubAdminComponent implements OnInit {
  // Admin statistics
  adminStats: AdminStats = {
    totalAdmins: 5,
    totalIncrease: 2,
    activeAdmins: 4,
    activeIncrease: 1,
    superAdmins: 1,
    superAdminsChange: 'N/A',
    inactiveAccounts: 1,
    inactiveIncrease: 0
  };

  // Mock admins data
  admins: AdminDisplay[] = [];
  allAdmins: AdminDisplay[] = [];
  
  // Filter dropdown visibility
  isFilterDropdownVisible: boolean = false;
  
  // Admin form properties
  isAdminModalVisible: boolean = false;
  adminForm!: FormGroup;
  
  // Admin edit state
  isEditMode: boolean = false;
  editAdminId: number | undefined;
  
  // Admin view state
  isViewMode: boolean = false;
  selectedAdmin: AdminDisplay | null = null;
  
  // Search functionality
  searchQuery: string = '';
  
  // Filters
  filters: Filters = {
    roles: {
      superAdmin: false,
      admin: false
    },
    status: {
      active: false,
      inactive: false
    }
  };
  
  // Sort option
  sortOption: string = 'name';
  
  // Active dropdown ID
  activeDropdownId: number | null = null;
    // Alert message properties
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  alertTimeout: any;
  
  constructor(private fb: FormBuilder, private adminSubAdminService: AdminSubAdminService) {
    this.initializeAdminForm();
  }

  ngOnInit(): void {
    // Load admin stats and data from service
    this.loadAdmins();
  }
  
 
  
  // Load admins from service
  loadAdmins(): void {
    // Set up filters for the service call
    const filters = {
      role: this.getFilterRole(),
      status: this.getFilterStatus(),
      searchTerm: this.searchQuery || undefined
    };
    
    this.adminSubAdminService.getAdmins(filters).subscribe({
      next: (admins) => {
        // Transform to display format
        this.admins = admins.map(admin => this.transformToAdminDisplay(admin));
        this.allAdmins = [...this.admins];
        // Apply any additional local filters
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading admins:', err);
        // Fallback to mock data if needed
        this.initializeMockData();
      }
    });
  }
  
  // Helper to get role filter string for API
  private getFilterRole(): string | undefined {
    if (this.filters.roles.superAdmin && !this.filters.roles.admin) {
      return 'superadmin';
    } else if (!this.filters.roles.superAdmin && this.filters.roles.admin) {
      return 'admin';
    }
    return undefined;
  }
  
  // Helper to get status filter string for API
  private getFilterStatus(): string | undefined {
    if (this.filters.status.active && !this.filters.status.inactive) {
      return 'active';
    } else if (!this.filters.status.active && this.filters.status.inactive) {
      return 'inactive';
    }
    return undefined;
  }
  
  // Transform raw admin user to display format
  private transformToAdminDisplay(admin: User): AdminDisplay {
    // Create initials from name
    const initials = `${admin.prenom?.[0] || ''}${admin.nom?.[0] || ''}`;
    
    // Determine status styling
    const statusClass = admin.estActif 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
    
    // Simple random last login for demonstration purposes
    const lastLoginOptions = ['Today', 'Yesterday', '2 days ago', 'Last week', '2 weeks ago'];
    const randomLastLogin = lastLoginOptions[Math.floor(Math.random() * lastLoginOptions.length)];
    
    return {
      ...admin,
      initials,
      statusClass,
      lastLogin: randomLastLogin,
      roleLabel: 'Admin',
      roleBadgeClass: 'role-badge-admin',
      roleIcon: 'fas fa-user-shield'
    };
  }
  
  private initializeAdminForm(): void {
    this.adminForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isSuperAdmin: [false] // Checkbox to determine if admin is a super admin
    });
  }
  
  private initializeMockData(): void {
    this.admins = [
      {
        id: 1,
        nom: 'Smith',
        prenom: 'John',
        email: 'john.smith@example.com',
        telephone: '+1 (555) 111-2222',
        role: Role.ADMIN,
        estActif: true,
        dateCreation: new Date('2023-01-15'),
        initials: 'JS',
        lastLogin: 'Today, 9:30 AM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-admin',
        roleIcon: 'fas fa-shield-alt',
        roleLabel: 'Super Admin'
      },
      {
        id: 2,
        nom: 'Johnson',
        prenom: 'Sarah',
        email: 'sarah.johnson@example.com',
        telephone: '+1 (555) 222-3333',
        role: Role.ADMIN,
        estActif: true,
        dateCreation: new Date('2023-02-20'),
        initials: 'SJ',
        lastLogin: 'Yesterday, 4:15 PM',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-admin',
        roleIcon: 'fas fa-user-shield',
        roleLabel: 'Admin'
      },
      {
        id: 3,
        nom: 'Wilson',
        prenom: 'Robert',
        email: 'robert.wilson@example.com',
        telephone: '+1 (555) 333-4444',
        role: Role.ADMIN,
        estActif: true,
        dateCreation: new Date('2023-03-25'),
        initials: 'RW',
        lastLogin: '3 days ago',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-admin',
        roleIcon: 'fas fa-user-shield',
        roleLabel: 'Admin'
      },
      {
        id: 4,
        nom: 'Taylor',
        prenom: 'Emma',
        email: 'emma.taylor@example.com',
        telephone: '+1 (555) 444-5555',
        role: Role.ADMIN,
        estActif: true,
        dateCreation: new Date('2023-04-10'),
        initials: 'ET',
        lastLogin: '1 week ago',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-admin',
        roleIcon: 'fas fa-user-shield',
        roleLabel: 'Admin'
      },
      {
        id: 5,
        nom: 'Brown',
        prenom: 'Michael',
        email: 'michael.brown@example.com',
        telephone: '+1 (555) 555-6666',
        role: Role.ADMIN,
        estActif: false,
        dateCreation: new Date('2023-05-05'),
        initials: 'MB',
        lastLogin: '2 weeks ago',
        statusClass: 'bg-gray-100 text-gray-800',
        roleBadgeClass: 'role-badge-admin',
        roleIcon: 'fas fa-user-shield',
        roleLabel: 'Admin'
      }
    ];
  }
  
  getActiveAdminsCount(): number {
    return this.admins.filter(admin => admin.estActif).length;
  }
  
  toggleFilterDropdown(): void {
    this.isFilterDropdownVisible = !this.isFilterDropdownVisible;
  }
  
  // Handle search input changes
  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      // If search is empty, reset to all admins
      this.admins = [...this.allAdmins];
    } else {
      // Filter admins by name, email, phone
      const query = this.searchQuery.toLowerCase().trim();
      this.admins = this.allAdmins.filter(admin => 
        // Search by full name
        `${admin.prenom} ${admin.nom}`.toLowerCase().includes(query) || 
        // Search by first name only
        admin.prenom?.toLowerCase().includes(query) ||
        // Search by last name only
        admin.nom?.toLowerCase().includes(query) ||
        // Search by email
        admin.email?.toLowerCase().includes(query) ||
        // Search by phone number
        admin.telephone?.toLowerCase().includes(query)
      );
    }
    // Apply any existing sort after filtering
    this.applySorting(this.admins);
    
    // Show feedback if no results found
    if (this.searchQuery.trim() && this.admins.length === 0) {
      this.showAlert(`No admins found matching "${this.searchQuery}"`, 'error', 3000);
    }
  }
  
  // Clear search and reset admins list
  clearSearch(): void {
    this.searchQuery = '';
    this.admins = [...this.allAdmins];
    this.applySorting(this.admins);
  }
  
  applyFilters(): void {
    let filteredAdmins = [...this.allAdmins];
    
    // Apply role filters if any are selected
    const roleFilters = Object.values(this.filters.roles).some(val => val);
    if (roleFilters) {
      filteredAdmins = filteredAdmins.filter(admin => {
        if (this.filters.roles.superAdmin && admin.roleLabel === 'Super Admin') return true;
        if (this.filters.roles.admin && admin.roleLabel === 'Admin') return true;
        return false;
      });
    }
    
    // Apply status filters if any are selected
    const statusFilters = Object.values(this.filters.status).some(val => val);
    if (statusFilters) {
      filteredAdmins = filteredAdmins.filter(admin => {
        if (this.filters.status.active && admin.estActif) return true;
        if (this.filters.status.inactive && !admin.estActif) return true;
        return false;
      });
    }
    
    // Apply sorting
    this.applySorting(filteredAdmins);
    
    this.admins = filteredAdmins;
  }
  
  clearFilters(): void {
    this.filters = {
      roles: {
        superAdmin: false,
        admin: false
      },
      status: {
        active: false,
        inactive: false
      }
    };
    
    this.admins = [...this.allAdmins];
    this.applySorting(this.admins);
  }
  
  applySorting(adminList: AdminDisplay[]): void {
    switch(this.sortOption) {
      case 'name':
        adminList.sort((a, b) => `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`));
        break;
      case 'role':
        adminList.sort((a, b) => (a.roleLabel || '').localeCompare(b.roleLabel || ''));
        break;
      case 'status':
        adminList.sort((a, b) => {
          if (a.estActif === b.estActif) return 0;
          return a.estActif ? -1 : 1;
        });
        break;
      case 'lastLogin':
        // This is a simplified implementation since lastLogin is just a string
        adminList.sort((a, b) => (a.lastLogin || '').localeCompare(b.lastLogin || ''));
        break;
      case 'dateCreated':
        adminList.sort((a, b) => {
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
    this.applySorting(this.admins);
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
    
    // Close admin action dropdown menus if clicked outside
    if (this.activeDropdownId !== null) {
      const actionDropdown = document.querySelector('.origin-top-right') as HTMLElement;
      const actionBtn = document.querySelector(`button[data-admin-id="${this.activeDropdownId}"]`) as HTMLElement;
      
      if (!actionDropdown || !actionDropdown.contains(event.target as Node)) {
        if (!actionBtn || !actionBtn.contains(event.target as Node)) {
          this.activeDropdownId = null;
        }
      }
    }
  }
  
  // Toggle admin modal visibility
  toggleAdminModal(): void {
    this.isAdminModalVisible = !this.isAdminModalVisible;
    if (!this.isAdminModalVisible) {
      this.resetAdminForm();
      this.isEditMode = false;
      this.editAdminId = undefined;
    } else if (!this.isEditMode) {
      // Reset validators for password - required in create mode
      this.adminForm.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
      this.adminForm.controls['password'].updateValueAndValidity();
      // Reset form if not in edit mode
      this.resetAdminForm();
    }
  }
  
  // Reset form when closing modal
  resetAdminForm(): void {
    this.adminForm.reset();
  }
    // Handle admin form submission
  onAdminSubmit(): void {
    if (this.adminForm.invalid) {
      return;
    }
    
    const formValues = this.adminForm.value;
    
    if (this.isEditMode && this.editAdminId) {
      // Update existing admin
      const adminIndex = this.admins.findIndex(a => a.id === this.editAdminId);
      
      if (adminIndex !== -1) {
        // Create updated admin object
        const existingAdmin = this.admins[adminIndex];
        const updatedAdmin: User = {
          ...existingAdmin,
          nom: formValues.nom,
          prenom: formValues.prenom,
          email: formValues.email,
          telephone: formValues.telephone,
          // Other properties from the form
        };
        
        // Update admin via service
        this.adminSubAdminService.updateAdmin(updatedAdmin).subscribe((e)=>{
          next: (result: AdminDisplay) => {
            // Update display object with new data
            const updatedDisplay: AdminDisplay = {
              ...result,
              initials: `${result.prenom?.[0] || ''}${result.nom?.[0] || ''}`,
              lastLogin: existingAdmin.lastLogin,
              statusClass: result.estActif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
              roleLabel: formValues.isSuperAdmin ? 'Super Admin' : 'Admin',
              roleBadgeClass: 'role-badge-admin',
              roleIcon: formValues.isSuperAdmin ? 'fas fa-shield-alt' : 'fas fa-user-shield'
            };
            
            // Update local UI data
            this.admins[adminIndex] = updatedDisplay;
        
        // Update the allAdmins array
        this.allAdmins = [...this.admins];
        
        console.log('Admin updated successfully:', this.admins[adminIndex]);
        this.showAlert('Admin updated successfully', 'success');
      }});
      } else {
      // Create new admin
      const newAdmin: AdminDisplay = {
        id: Math.max(...this.admins.map(a => a.id || 0)) + 1,
        nom: formValues.nom,
        prenom: formValues.prenom,
        email: formValues.email,
        telephone: formValues.telephone,
        identifiant: `${formValues.prenom.toLowerCase()[0]}${formValues.nom.toLowerCase()}`,
        password: formValues.password,
        role: Role.ADMIN,
        estActif: true,
        dateCreation: new Date(),
        initials: `${formValues.prenom[0]}${formValues.nom[0]}`,
        lastLogin: 'Just now',
        statusClass: 'bg-green-100 text-green-800',
        roleBadgeClass: 'role-badge-admin',
        roleIcon: formValues.isSuperAdmin ? 'fas fa-shield-alt' : 'fas fa-user-shield',
        roleLabel: formValues.isSuperAdmin ? 'Super Admin' : 'Admin'
      };
      
      // Add to local data for UI
      this.admins.unshift(newAdmin);
      this.allAdmins = [...this.admins];
      
      console.log('Admin created successfully:', newAdmin);
      this.showAlert('Admin created successfully', 'success');
    }
    
    // Close modal and reset form
    this.toggleAdminModal();
  }
}
  // Edit admin
  editAdmin(admin: AdminDisplay): void {
    this.isEditMode = true;
    this.editAdminId = admin.id;
    
    // Update form validation for password - not required in edit mode
    this.adminForm.controls['password'].clearValidators();
    this.adminForm.controls['password'].updateValueAndValidity();
    
    // Populate the form with the admin's data
    this.adminForm.patchValue({
      prenom: admin.prenom,
      nom: admin.nom,
      email: admin.email,
      telephone: admin.telephone,
      isSuperAdmin: admin.roleLabel === 'Super Admin'
    });
    
    // Show the modal
    this.isAdminModalVisible = true;
  }
  
  // View admin details
  viewAdminDetails(admin: AdminDisplay): void {
    this.selectedAdmin = admin;
    this.isViewMode = true;
  }
  
  // Close admin details view
  closeAdminDetails(): void {
    this.selectedAdmin = null;
    this.isViewMode = false;
  }
  
  // Toggle admin actions dropdown
  toggleAdminActions(adminId: number | undefined): void {
    if (adminId === undefined) return;
    this.activeDropdownId = this.activeDropdownId === adminId ? null : adminId;
  }
  
  // Toggle admin active status
  toggleAdminStatus(admin: AdminDisplay): void {
    if (admin) {
      admin.estActif = !admin.estActif;
      admin.statusClass = admin.estActif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
      
      // Close dropdown menu
      this.activeDropdownId = null;
      
      console.log(`Admin ${admin.prenom} ${admin.nom} is now ${admin.estActif ? 'active' : 'inactive'}`);
      this.showAlert(`Admin ${admin.prenom} ${admin.nom} is now ${admin.estActif ? 'active' : 'inactive'}`, 'success');
    }
  }
  
  // Delete admin
  deleteAdmin(adminId: number | undefined): void {
    if (adminId=== undefined) return;
    
    if (confirm('Are you sure you want to delete this admin?')) {
      this.admins = this.admins.filter(admin => admin.id !== adminId);
      this.allAdmins = [...this.admins];
      console.log('Admin deleted successfully');
      this.showAlert('Admin deleted successfully', 'success');
    }
  }
  
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
}
