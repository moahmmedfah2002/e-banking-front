import {Component, Input} from '@angular/core';
import {User} from '../../modele/User';

@Component({
  selector: 'app-transaction-main',
  standalone: false,
  templateUrl: './transaction-main.component.html',
  styleUrl: './transaction-main.component.css'
})
export class TransactionMainComponent {
  @Input()
  public client?: User;
}
