import {Component, Input} from '@angular/core';
import {User} from '../../modele/User';

@Component({
  selector: 'app-main-content',
  standalone: false,
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {
  @Input()
  public user:User=new User();
  constructor() {

  }


  protected  date = new Date();
  protected  String = String;
}
