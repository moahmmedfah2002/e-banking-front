import {Component, HostBinding, Input} from '@angular/core';
import {Compte} from '../../../modele/Compte';

@Component({
  selector: 'carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css'],
  standalone: false
})
export class CarteComponent{
  @Input() accountData: Compte | null = null;

  @Input() type: string = "Compte courant";
  @Input() balance: string = "$ 0.00";
  @Input() carte_numbre: number = 0;
  @Input() account_number: string = "0000-0000-0000";
  @Input() routing_number: string = "000000000";
  
  @HostBinding("style.--color")
  @Input()
  public color: string='linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';

  ngOnInit() {
    // Update component properties if accountData is provided
    if (this.accountData) {
      this.type = this.accountData.typeCompte || this.type;
      this.balance = this.formatCurrency(this.accountData.solde || 0);
      this.account_number = this.accountData.numericCompte || this.account_number;
      // Last 4 digits of account number for card display
      this.carte_numbre = parseInt(this.account_number.substring(Math.max(0, this.account_number.length - 4)));
    }
  }

  private formatCurrency(amount: number): string {
    return '$ ' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
