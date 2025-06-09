import {Component, Input} from '@angular/core';
import {User} from '../../modele/User';
import {Compte} from '../../modele/Compte';

@Component({
  selector: 'app-saving-card',
  standalone: false,
  templateUrl: './saving-card.component.html',
  styleUrl: './saving-card.component.css'
})
export class SavingCardComponent {
  @Input()
  public compte?: Compte;

}
