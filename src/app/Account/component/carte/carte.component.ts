import {Component, HostBinding, Input} from '@angular/core';
import {Compte} from '../../../modele/Compte';

@Component({
  selector: 'carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css'],
  standalone: false
})
export class CarteComponent{
  @Input() accountData?: Compte ;

 public type?: string = this.accountData?.typeCompte;
 public balance?: number = this.accountData?.solde;
  @Input() carte_numbre: number = 0;
  @Input() account_number?: string = this.accountData?.numericCompte;


  @HostBinding("style.--color")
  @Input()
  public color: string='linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';

  ngOnInit() {
    // Update component properties if accountData is provided
    if (this.accountData) {
      this.type = this.accountData.typeCompte || this.type;


    }
  }

  private formatCurrency(amount: number): string {
    return '$ ' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
