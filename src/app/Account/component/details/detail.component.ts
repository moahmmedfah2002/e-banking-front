import {Component, OnInit} from '@angular/core';
import {PersonalInfo, LoginActivity, AccountChange, ConnectedDevice} from '../../../../models/account';


@Component({
  selector: 'details-account',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  standalone: false
})
export class AccountDetails implements OnInit {
  personalInfo: PersonalInfo;
  loginActivities: LoginActivity[] = [];
  accountChanges: AccountChange[] = [];
  connectedDevices: ConnectedDevice[] = [];
  isEditMode: boolean = false;
  constructor() {
    // Initialize with mock data for personal info
    this.personalInfo = {
      fullName: 'John A. Smith',
      dateOfBirth: '1985-06-15',
      formattedDateOfBirth: 'June 15, 1985',
      ssn: 'XXX-XX-4321',
      nationality: 'US',
      occupation: 'Software Engineer',
      employer: 'Tech Innovations Inc.',
      annualIncome: '$75,000 - $100,000',
      maritalStatus: 'Married'
    };

    // Initialize mock data for login activity
    this.loginActivities = [
      {
        date: 'Jun 1, 2025 - 10:23 AM',
        device: 'iPhone 15',
        location: 'New York, NY',
        ipAddress: '192.168.1.1',
        status: 'Successful'
      },
      {
        date: 'May 29, 2025 - 3:45 PM',
        device: 'Windows PC',
        location: 'New York, NY',
        ipAddress: '192.168.1.2',
        status: 'Successful'
      },
      {
        date: 'May 28, 2025 - 7:12 PM',
        device: 'Android Phone',
        location: 'Boston, MA',
        ipAddress: '45.23.156.89',
        status: 'Failed'
      }
    ];

    // Initialize mock data for account changes
    this.accountChanges = [
      {
        date: 'May 25, 2025 - 2:30 PM',
        action: 'Password Updated',
        changedBy: 'Account Owner'
      },
      {
        date: 'May 20, 2025 - 11:15 AM',
        action: 'Email Address Changed',
        changedBy: 'Account Owner'
      },
      {
        date: 'May 15, 2025 - 9:45 AM',
        action: 'Two-Factor Authentication Enabled',
        changedBy: 'Account Owner'
      }
    ];

    // Initialize mock data for connected devices
    this.connectedDevices = [
      {
        name: 'iPhone 15',
        lastActive: 'Today at 10:23 AM',
        isCurrent: true,
        icon: 'mobile'
      },
      {
        name: 'Windows PC',
        lastActive: 'May 29, 2025 at 3:45 PM',
        isCurrent: false,
        icon: 'desktop'
      },
      {
        name: 'Android Phone',
        lastActive: 'May 24, 2025 at 8:12 AM',
        isCurrent: false,
        icon: 'mobile'
      }
    ];
  }  ngOnInit(): void {
    // Set up event listeners for the UI interactions
    this.setupEventListeners();
    
    // Ensure view mode is visible by default when the page loads
    setTimeout(() => {
      const viewSection = document.getElementById('view-personal-info');
      const editSection = document.getElementById('edit-personal-info-form');
      
      if (viewSection) viewSection.style.display = 'block';
      if (editSection) editSection.classList.add('hidden');
    }, 100);
  }

  setupEventListeners(): void {
    // Wait for DOM to be ready
    setTimeout(() => {
      const editButton = document.getElementById('edit-personal-info');
      const cancelButton = document.getElementById('cancel-personal-info');
      const saveButton = document.getElementById('save-personal-info');
      const viewSection = document.getElementById('view-personal-info');
      const editSection = document.getElementById('edit-personal-info-form');
      const changePasswordBtn = document.getElementById('change-password-btn');
      const passwordInfo = document.getElementById('password-info');
      const passwordForm = document.getElementById('change-password-form');
      const cancelPasswordBtn = document.getElementById('cancel-password');
      const tabElements = document.querySelectorAll('.tab');

      // Tab switching
      tabElements.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetId = tab.getAttribute('data-tab');
          this.activateTab(targetId);
        });
      });      // Personal info edit mode
      if (editButton) {
        editButton.addEventListener('click', () => {
          this.isEditMode = true; // Update the edit mode flag
          
          if (viewSection) viewSection.style.display = 'none';
          if (editSection) {
            editSection.style.display = 'block';
            editSection.classList.remove('hidden');
          }
          
          // Set focus to the first input field when edit mode is activated
          const firstInput = document.getElementById('full-name') as HTMLInputElement;
          if (firstInput) firstInput.focus();
        });
      }      // Disable edit mode
      const disableEditButton = document.getElementById('disable-edit-mode');
      if (disableEditButton) {
        disableEditButton.addEventListener('click', () => {
          this.isEditMode = false; // Update the edit mode flag
          if (editSection) editSection.classList.add('hidden');
          if (viewSection) viewSection.style.display = 'block';
        });
      }
      
      // Cancel editing personal info
      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          this.isEditMode = false; // Update the edit mode flag
          if (editSection) editSection.classList.add('hidden');
          if (viewSection) viewSection.style.display = 'block';
        });
      }      // Save personal info changes
      if (saveButton) {
        saveButton.addEventListener('click', () => {
          this.isEditMode = false; // Update the edit mode flag
          this.updatePersonalInfo();
          if (editSection) editSection.classList.add('hidden');
          if (viewSection) viewSection.style.display = 'block';
        });
      }

      // Change password form
      if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
          if (passwordInfo) passwordInfo.style.display = 'none';
          if (passwordForm) {
            passwordForm.style.display = 'block';
            passwordForm.classList.remove('hidden');
          }
        });
      }

      // Cancel password change
      if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
          if (passwordForm) passwordForm.classList.add('hidden');
          if (passwordInfo) passwordInfo.style.display = 'flex';
        });
      }
      
      // Save password changes
      const savePasswordBtn = document.getElementById('save-password');
      if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', () => {
          this.updatePassword();
        });
      }
    }, 100);
  }

  activateTab(tabId: string | null): void {
    if (!tabId) return;

    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      content.classList.remove('active');
    });

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.classList.remove('tab-active');
    });

    // Show the selected tab content
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
      selectedContent.classList.add('active');
    }

    // Add active class to the clicked tab
    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (selectedTab) {
      selectedTab.classList.add('tab-active');
    }
  }
  updatePersonalInfo(): void {
    // Get values from form
    const fullNameInput = document.getElementById('full-name') as HTMLInputElement;
    const dateOfBirthInput = document.getElementById('date-of-birth') as HTMLInputElement;
    const nationalitySelect = document.getElementById('nationality') as HTMLSelectElement;
    const occupationInput = document.getElementById('occupation') as HTMLInputElement;
    const employerInput = document.getElementById('employer') as HTMLInputElement;
    const incomeSelect = document.getElementById('income') as HTMLSelectElement;
    const maritalStatusSelect = document.getElementById('marital-status') as HTMLSelectElement;

    if (fullNameInput && fullNameInput.value) {
      this.personalInfo.fullName = fullNameInput.value;
    }
    
    if (dateOfBirthInput && dateOfBirthInput.value) {
      this.personalInfo.dateOfBirth = dateOfBirthInput.value;
      // Format date for display
      const date = new Date(dateOfBirthInput.value);
      this.personalInfo.formattedDateOfBirth = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (nationalitySelect) {
      this.personalInfo.nationality = nationalitySelect.options[nationalitySelect.selectedIndex].text;
    }

    if (occupationInput) {
      this.personalInfo.occupation = occupationInput.value;
    }

    if (employerInput) {
      this.personalInfo.employer = employerInput.value;
    }

    if (incomeSelect) {
      this.personalInfo.annualIncome = incomeSelect.options[incomeSelect.selectedIndex].text;
    }

    if (maritalStatusSelect) {
      this.personalInfo.maritalStatus = maritalStatusSelect.options[maritalStatusSelect.selectedIndex].text;
    }
    

    console.log('Updated personal info:', this.personalInfo);
  }

  removeDevice(deviceName: string): void {
    // Find the device by name and remove it (except for current device)
    const deviceIndex = this.connectedDevices.findIndex(device => device.name === deviceName && !device.isCurrent);
    if (deviceIndex !== -1) {
      this.connectedDevices.splice(deviceIndex, 1);
      console.log(`Device removed: ${deviceName}`);
    }
  }
  
  updatePassword(): void {
    // Here we would normally validate and submit the password change
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    
    if (!currentPasswordInput.value || !newPasswordInput.value || !confirmPasswordInput.value) {
      console.error('All password fields are required');
      return;
    }
    
    if (newPasswordInput.value !== confirmPasswordInput.value) {
      console.error('New password and confirmation do not match');
      return;
    }
    
    // Mock successful password change
    console.log('Password updated successfully');
    
    // Reset the form and hide it
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    
    const passwordForm = document.getElementById('change-password-form');
    const passwordInfo = document.getElementById('password-info');
    
    if (passwordForm) {
      passwordForm.classList.add('hidden');
    }
    
    if (passwordInfo) {
      passwordInfo.style.display = 'flex';
      
      // Update the last changed date to today
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      
      const passwordChangeInfoElement = passwordInfo.querySelector('p.text-sm');
      if (passwordChangeInfoElement) {
        passwordChangeInfoElement.textContent = `Password last changed: ${formattedDate}`;
      }
    }
  }
  
  // Method to handle disabling edit mode
  disableEditMode(): void {
    this.isEditMode = false;
    
    const viewSection = document.getElementById('view-personal-info');
    const editSection = document.getElementById('edit-personal-info-form');
    
    if (editSection) editSection.classList.add('hidden');
    if (viewSection) viewSection.style.display = 'block';
  }
}
