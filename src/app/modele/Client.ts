import { Compte } from "./Compte";
import { User } from "./User";

export interface Client extends User {
  numeroClient: number;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  dateNaissance: Date;
  cin: string;
  comptes: Compte[];
}