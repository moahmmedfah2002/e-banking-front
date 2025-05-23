import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../modele/User';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  @Input()
  public user:User=new User();
  constructor(public router: Router) {
  }


}
