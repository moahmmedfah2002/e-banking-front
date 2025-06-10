import {Component, inject, OnInit} from '@angular/core';
import {User} from '../modele/User';
import {HomeService} from '../services/homeService';
import {Compte} from '../modele/Compte';
import {Router} from '@angular/router';

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
    });}





}
