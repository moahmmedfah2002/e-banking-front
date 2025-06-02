import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { User } from '../modele/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
logout() {
    sessionStorage.removeItem('authToken');
    this.router.navigate(['/login']);
}
sendHelp() {
  
}

  @Input()
    public user:User=new User();
    constructor(public router: Router) {
    }
}
