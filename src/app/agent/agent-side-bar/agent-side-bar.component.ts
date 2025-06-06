import { Component, inject } from '@angular/core';
import { User } from '../../modele/User';
import { HomeService } from '../../services/homeService';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-agent-side-bar',
  standalone: false,
  templateUrl: './agent-side-bar.component.html',
  styleUrl: './agent-side-bar.component.css'
})
export class AgentSideBarComponent {
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
