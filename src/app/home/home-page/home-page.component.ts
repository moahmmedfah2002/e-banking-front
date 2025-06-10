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
  public client: User = new User();
  public homeService: HomeService = inject(HomeService);
  public router: Router = inject(Router);
  public selectedCompte: Compte | null = null;

  ngOnInit(): void {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.loadClientData(token);

    }
  }

  private loadClientData(token: string): void {
    this.homeService.getUser(token).subscribe({
      next: (client: User) => {
        this.client = client;
        // Select first account by default if available
        if (client.comptes && client.comptes.length > 0) {
          this.selectedCompte = client.comptes[0];
        }
      },
      error: (err) => {
        console.error('Error fetching client data:', err);
        // Handle error (e.g., show error message, redirect to login)
      }
    });
  }

  selectCompte(compte: Compte): void {
    this.selectedCompte = compte;
  }

  // Helper method to get user full name
  get userFullName(): string {
    return `${this.client.prenom} ${this.client.nom}`;
  }

  // Helper method to format dates
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-MA');
  }
}
