import {Role} from './Role';
import {Compte} from './Compte';
import {Transaction} from './Transactions';

export class User {
  public  id?:number;

  public  nom?:string;
  public  prenom?:string;
  public  email?:string;
  public  telephone?:string;
  public  identifiant?:string;
  public  password?:string;
  public role?:Role;
  public dateCreation?:Date;
  public estActif?:boolean;
  public comptes?:Array<Compte>;
  public transactions?:Array<Transaction>;
}
