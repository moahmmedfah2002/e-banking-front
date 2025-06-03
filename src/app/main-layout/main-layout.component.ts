import {Component, inject} from '@angular/core';
import {User} from '../modele/User';
import {HomeService} from '../services/homeService';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  public user:User=new User();
  public homeService:HomeService=inject(HomeService);
  constructor() {
    let token = sessionStorage.getItem('authToken');

    if(token!=null) {

      this.homeService.getUser(token).subscribe(e => {
        this.user = e;
      });
    }
  }


}
