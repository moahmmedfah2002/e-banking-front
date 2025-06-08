import { Role } from './Role';
import { Compte } from './Compte';

export class User {
  public id?: number;
  public nom?: string;
  public prenom?: string;
  public email?: string;
  public password?: string;
  public role?: Role;
  public telephone?: string;
  public identifiant?: string;
  public dateCreation?: Date;
  public estActif?: boolean;
  public enabled?: boolean;
  public comptes?: Compte[];
  public virements?: [];
  public adresse?: string;
  public cin?: string;
  public dateNaissance?: Date;
  public profession?: string;

  constructor() {
    this.comptes = [];
    this.virements = [];
  }
}
