import {Component, inject, OnInit} from '@angular/core';
import {User} from '../../modele/User';
import {Router} from '@angular/router';
import {HomeService} from '../../services/homeService';
import { Compte } from '../../modele/Compte';
import { Transaction } from '../../modele/Transaction';
import { Client } from '../../modele/Client';
import { MOCK_ACCOUNTS } from '../../modele/mock-accounts';
import { MOCK_TRANSACTIONS } from '../../modele/mock-transactions';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  public user: User = new User();
  public homeService: HomeService = inject(HomeService);
  public router: Router = inject(Router);
  
  // New properties for account selection functionality
  public comptes: Compte[] = [];
  public selectedCompte: Compte | null = null;
  public displayedTransactions: Transaction[] = [];
new: Date|undefined;
  currentDate: Date = new Date();
  ngOnInit(): void {
    // Check if user is authenticated
    // let token = sessionStorage.getItem('authToken');
    // if (token == null) {
    //   this.router.navigate(['/login']);
    // } else {
    //   // In a real application, we would call the service
    //   // For now, set up mock data
    //   this.setupMockData();
    // }
    this.setupMockData();
  }

  private setupMockData(): void {
    // Set up mock user data
    this.user.id = 1;
    this.user.nom = 'Mohammed';
    this.user.prenom = 'Fahlaoui';
    this.user.identifiant = 'mohammed';
    this.user.email = 'mohammed@example.com';
    this.user.telephone = '+212 600000000';
    this.user.estActif = true;
    
    // Set up mock accounts
    this.comptes = this.createMockAccounts();
    this.user.comptes = this.comptes;
    
    // Select first account by default
    if (this.comptes.length > 0) {
      this.selectCompte(this.comptes[0]);
    }
  }

  private createMockAccounts(): Compte[] {
    // Create two mock accounts with their own transactions
    const compte1 = new Compte();
    compte1.numericCompte = 'MA123456789';
    compte1.solde = 10000;
    compte1.statue = true;
    compte1.dateCreation = new Date('2022-01-15');
    compte1.typeCompte = 'Courant';
    
    const compte2 = new Compte();
    compte2.numericCompte = 'MA987654321';
    compte2.solde = 25000;
    compte2.statue = true;
    compte2.dateCreation = new Date('2021-06-20');
    compte2.typeCompte = 'Epargne';
    
    // Create transactions for compte1
    const transactions1: Transaction[] = [
      {
        id: 1,
        monet: 420.75,
        dateTransaction: new Date('2025-06-05T11:42:00'),
        typeTransaction: 'Sortante',
        compteAdebit: 'MA123456789',
        compteAcredit: 'MA5555555'
      },
      {
        id: 2,
        monet: 1200,
        dateTransaction: new Date('2025-06-03T09:15:00'),
        typeTransaction: 'Entrante',
        compteAdebit: 'MA6666666',
        compteAcredit: 'MA123456789'
      },
      {
        id: 3,
        monet: 350.50,
        dateTransaction: new Date('2025-06-01T14:22:00'),
        typeTransaction: 'Sortante',
        compteAdebit: 'MA123456789',
        compteAcredit: 'MA7777777'
      }
    ];
    
    // Create transactions for compte2
    const transactions2: Transaction[] = [
      {
        id: 4,
        monet: 550.25,
        dateTransaction: new Date('2025-06-04T16:30:00'),
        typeTransaction: 'Sortante',
        compteAdebit: 'MA987654321',
        compteAcredit: 'MA8888888'
      },
      {
        id: 5,
        monet: 3000,
        dateTransaction: new Date('2025-06-02T10:45:00'),
        typeTransaction: 'Entrante',
        compteAdebit: 'MA9999999',
        compteAcredit: 'MA987654321'
      }
    ];
    
    // Assign transactions to accounts
    compte1.transactions = transactions1;
    compte2.transactions = transactions2;
    
    return [compte1, compte2];
  }

  // Method to handle account selection
  selectCompte(compte: Compte): void {
    this.selectedCompte = compte;
    
    // Update displayed transactions based on selected account
    if (compte.transactions) {
      this.displayedTransactions = compte.transactions;
    } else {
      this.displayedTransactions = [];
    }
  }
  
  // Helper methods for formatting and displaying data
  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString('fr-MA');
  }
  
  getTransactionTypeClass(type: string | undefined): string {
    return type === 'Sortante' ? 'transaction-outgoing' : 'transaction-incoming';
  }
  
  getTransactionIcon(type: string | undefined): string {
    return type === 'Sortante' ? 'arrow_upward' : 'arrow_downward';
  }
  
  getTransactionLabel(transaction: Transaction): string {
    if (transaction.typeTransaction === 'Sortante') {
      return `Paiement vers ${transaction.compteAcredit}`;
    } else {
      return `Reçu de ${transaction.compteAdebit}`;
    }
  }
}
