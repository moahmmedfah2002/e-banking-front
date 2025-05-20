import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css'],
  standalone: false
})
export class CarteComponent{
  public type="Compte courant";
  public balance="$ 300,000.000";
  public carte_numbre =4566;
  public account_number="0000-0000-0000"
  public routing_number="000000000"
  @HostBinding("style.--color")
  @Input()
  public color: string='linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';

}
