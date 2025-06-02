import { Transaction } from './Transaction';

export class Compte {
  public numericCompte?:string;
  public solde?:number;
  public statue?:boolean;
  public dateCreation?:Date;
  public typeCompte?:string;
  
  public transactions?: Transaction[];
  public transactionsBill?: Transaction[];
  public transactionsMobile?: Transaction[];
}
