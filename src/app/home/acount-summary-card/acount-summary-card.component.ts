import {Component, Input} from '@angular/core';
import {Compte} from '../../modele/Compte';

@Component({
  selector: 'app-acount-summary-card',
  standalone: false,
  templateUrl: './acount-summary-card.component.html',
  styleUrl: './acount-summary-card.component.css'
})
export class AcountSummaryCardComponent {
  @Input()
  accounts:Array<Compte>|undefined=new Array<Compte>();

}
