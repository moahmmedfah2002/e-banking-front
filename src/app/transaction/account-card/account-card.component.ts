import {Component, Input} from '@angular/core';
import {User} from '../../modele/User';
import {Compte} from '../../modele/Compte';

@Component({
  selector: 'app-account-card',
  standalone: false,
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.css'
})
export class AccountCardComponent {
  @Input()
  public compte?: Compte;

}
