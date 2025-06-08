import {Component, inject, OnInit} from '@angular/core';
import {HomeService} from '../../services/homeService';
import {User} from '../../modele/User';
import {Router} from '@angular/router';

@Component({
  selector: 'app-transaction-page',
  standalone: false,
  templateUrl: './transaction-page.component.html',
  styleUrl: './transaction-page.component.css'
})
export class TransactionPageComponent implements OnInit {



  public homeService: HomeService=inject(HomeService);
  public client?: User|undefined;
  public router: Router=inject(Router);
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

      },
      error: (err) => {
        console.error('Error fetching client data:', err);
        // Handle error (e.g., show error message, redirect to login)
      }
    });
  }



}
