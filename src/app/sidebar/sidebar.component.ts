import {Component, inject} from '@angular/core';
import { Input } from '@angular/core';
import { User } from '../modele/User';
import { Router } from '@angular/router';
import {HomeService} from '../services/homeService';
import {UpperCasePipe} from '@angular/common';

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

  public user:User=new User();
  public homeService:HomeService=inject(HomeService);
  constructor(public router: Router) {
    let token = sessionStorage.getItem('authToken');

    if(token!=null) {

      this.homeService.getUser(token).subscribe(e => {
        this.user = e;
      });
    }}

  protected readonly UpperCasePipe = UpperCasePipe;
}
