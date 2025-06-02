import {Component, Input} from '@angular/core';
import {User} from '../../modele/User';
import { Compte } from '../../modele/Compte';

@Component({
  selector: 'app-main-content',
  standalone: false,
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {
  @Input()
  public user:User=new User();
  comptes:Compte[] = [
    {
      numericCompte: '1234-5678-9012',
      typeCompte: 'Compte courant',
      solde: 1500.00,
      statue: true,
      dateCreation: new Date('2023-01-01'),
      transactions: [
        {
          id: 1,
          monet: 500.00,
          dateTransaction: new Date('2023-01-15'),
          typeTransaction: 'Entrante',
          compteAdebit: '',
          compteAcredit: '1234-5678-9012'
        },
        {
          id: 2,
          monet: 200.00,
          dateTransaction: new Date('2023-02-01'),
          typeTransaction: 'Sortante',
          compteAdebit: '1234-5678-9012',
          compteAcredit: '9876-5432-1098'
        }
      ],
      transactionsBill: [
        {
          id: 3,
          monet: 75.00,
          dateTransaction: new Date('2023-01-25'),
          typeTransaction: 'Sortante',
          compteAdebit: '1234-5678-9012',
          compteAcredit: 'ELEC-BILL-001'
        }
      ],
      transactionsMobile: [
        {
          id: 4,
          monet: 50.00,
          dateTransaction: new Date('2023-02-05'),
          typeTransaction: 'Sortante',
          compteAdebit: '1234-5678-9012',
          compteAcredit: 'MOBILE-TOP-UP'
        }
      ]
    },


    {
      numericCompte: '9876-5432-1098',
      typeCompte: 'Compte épargne',
      solde: 3000.00,
      dateCreation: new Date('2022-05-15'),
      statue: true,
      transactions: [
        {
          id: 5,
          monet: 1000.00,
          dateTransaction: new Date('2022-06-20'),
          typeTransaction: 'Entrante',
          compteAdebit: '',
          compteAcredit: '9876-5432-1098'
        },
        {
          id: 6,
          monet: 200.00,
          dateTransaction: new Date('2023-02-01'),
          typeTransaction: 'Entrante',
          compteAdebit: '1234-5678-9012',
          compteAcredit: '9876-5432-1098'
        }
      ],
      transactionsBill: [],
      transactionsMobile: []
    }
  ];
  protected selectedCompte:Compte;
  constructor() {
    this.selectedCompte = this.comptes[0]; // Set default selected account
  }

  protected  date = new Date();
  protected  String = String;
}
