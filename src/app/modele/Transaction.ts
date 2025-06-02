export interface Transaction {
    id?: number;
    monet?: number;
    dateTransaction?: Date;
     typeTransaction?: string; // 'Entrante' | 'Sortante'
    compteAdebit?: string; // Account number debited
    compteAcredit?: string;
}
