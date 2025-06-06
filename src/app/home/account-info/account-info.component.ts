import { Component, Input } from '@angular/core';
import { Compte } from '../../modele/Compte';

@Component({
  selector: 'app-account-info',
  standalone: false,
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent {
 @Input()
 public comptes:Array<any>|undefined=new Array<any>();

 constructor() {
 }
}
