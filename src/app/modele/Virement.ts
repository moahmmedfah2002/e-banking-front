// Virement.ts
export interface Virement {
  id?: number;
  montant: number;
  dateTransaction: Date | string;
  typeTransaction: 'Entrante' | 'Sortante';
  namesource?: string;
  namedest?: string;
  // Add other properties as needed
}
