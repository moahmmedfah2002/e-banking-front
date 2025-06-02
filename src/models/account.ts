export interface Account {
  numericCompte: string;
  solde: number;
  statue: boolean;
  dateCreation: string;
  typeCompte: string;
}

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  formattedDateOfBirth: string;
  ssn: string;
  nationality: string;
  occupation: string;
  employer: string;
  annualIncome: string;
  maritalStatus: string;
}

export interface LoginActivity {
  date: string;
  device: string;
  location: string;
  ipAddress: string;
  status: 'Successful' | 'Failed';
}

export interface AccountChange {
  date: string;
  action: string;
  changedBy: string;
}

export interface ConnectedDevice {
  name: string;
  lastActive: string;
  isCurrent: boolean;
  icon: string;
}