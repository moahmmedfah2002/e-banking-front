import {Component, Input} from '@angular/core';
import {User} from '../../modele/User';

@Component({
  selector: 'app-card-container',
  standalone: false,
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.css'
})
export class CardContainerComponent {
  @Input()
  public client?: User;

}
