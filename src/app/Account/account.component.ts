import {Component, OnInit} from '@angular/core';
import {User} from '../modele/User';
import {HomeService} from '../services/homeService';
import {Compte} from '../modele/Compte';

interface AccountActivity {
  date: string;
  activity: string;
  description: string;
  status: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

@Component({
  selector: 'account-component',
  templateUrl: 'account.component.html',
  styleUrls: ['account.component.css'],
  standalone: false
})
export class AccountComponent implements OnInit {
  user: User = {};
  accounts: Compte[] = [];
  accountActivities: AccountActivity[] = [];
  loading: boolean = true;
  currentPage: number = 1;
  pageSize: number = 4;
  totalActivities: number = 0;

  constructor(private homeService: HomeService) {}
  ngOnInit(): void {
    // Check if there's a token for real data, otherwise use mock data
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      this.loadUserData(token);
    } else {
      this.loadMockData(); // Use mock data if no token is present
    }
  }

  loadUserData(token: string): void {
    this.homeService.getUser(token).subscribe({
      next: (userData: User) => {
        this.user = userData;
        this.accounts = userData.comptes || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.loadMockData(); // Fallback to mock data on error
      }
    });
  }

  loadMockData(): void {
    // Mock user data
    this.user = {
      id: 1,
      nom: 'Smith',
      prenom: 'John',
      email: 'john.smith@example.com',
      telephone: '+1 (555) 123-4567',
      identifiant: 'jsmith123',
      estActif: true,
      dateCreation: new Date('2023-05-15'),
      comptes: []
    };

    // Mock account data
    this.accounts = [
      {
        numericCompte: '1234-5678-9012',
        solde: 24500.75,
        statue: true,
        dateCreation: new Date('2023-05-15'),
        typeCompte: 'Checking Account'
      },
      {
        numericCompte: '9876-5432-1098',
        solde: 153250.50,
        statue: true,
        dateCreation: new Date('2023-07-22'),
        typeCompte: 'Savings Account'
      },
      {
        numericCompte: '5555-6666-7777',
        solde: 5000.00,
        statue: true,
        dateCreation: new Date('2024-02-10'),
        typeCompte: 'Investment Account'
      }
    ];

    // Add mock accounts to user
    this.user.comptes = this.accounts;

    // Create mock account activities
    this.accountActivities = [
      {
        date: '2025-05-25',
        activity: 'Deposit',
        description: 'Salary payment',
        status: 'Completed',
        icon: 'arrow-down',
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100'
      },
      {
        date: '2025-05-20',
        activity: 'Withdrawal',
        description: 'ATM withdrawal',
        status: 'Completed',
        icon: 'arrow-up',
        iconColor: 'text-red-500',
        iconBg: 'bg-red-100'
      },
      {
        date: '2025-05-15',
        activity: 'Transfer',
        description: 'To savings account',
        status: 'Completed',
        icon: 'arrow-right',
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100'
      },
      {
        date: '2025-05-10',
        activity: 'Payment',
        description: 'Electric bill',
        status: 'Completed',
        icon: 'credit-card',
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-100'
      }
    ];    this.totalActivities = this.accountActivities.length;
    this.loading = false;
  }

  

  onPageChange(direction: string): void {
    if (direction === 'next' && this.currentPage * this.pageSize < this.totalActivities) {
      this.currentPage++;
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    }
    
    // Here you would load the activities for the new page
    // For now we just simulate with the same data
  }

  get paginationInfo(): string {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalActivities);
    return `Showing ${start} to ${end} of ${this.totalActivities} activities`;
  }
}
