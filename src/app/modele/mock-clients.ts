import { Client } from './Client';
import { Role } from './Role';

// Create our mock clients
// @ts-ignore
// @ts-ignore
export const MOCK_CLIENTS: Client[] = [
  {
    id: 1,
    nom: 'Williams',
    prenom: 'Emily',
    email: 'emily.williams@example.com',
    telephone: '+1 (555) 123-4567',
    identifiant: 'ewilliams',

    estActif: false,
    dateCreation: new Date('2024-03-18'),
    numeroClient: 1001,
    adresse: '123 Main St',
    ville: 'Springfield',
    codePostal: '12345',
    pays: 'United States',
    dateNaissance: new Date('1990-05-15'),
    cin: 'AB123456',
    comptes: []
  },
  {
    id: 2,
    nom: 'Brown',
    prenom: 'Michael',
    email: 'michael.brown@example.com',
    telephone: '+1 (555) 234-5678',
    identifiant: 'mbrown',

    estActif: true,
    dateCreation: new Date('2024-04-05'),
    numeroClient: 1002,
    adresse: '456 Oak Avenue',
    ville: 'Riverdale',
    codePostal: '67890',
    pays: 'United States',
    dateNaissance: new Date('1985-08-22'),
    cin: 'CD789012',
    comptes: []
  },
  {
    id: 3,
    nom: 'Garcia',
    prenom: 'Sofia',
    email: 'sofia.garcia@example.com',
    telephone: '+1 (555) 345-6789',
    identifiant: 'sgarcia',

    estActif: true,
    dateCreation: new Date('2024-05-15'),
    numeroClient: 1003,
    adresse: '789 Pine Street',
    ville: 'Maplewood',
    codePostal: '10112',
    pays: 'United States',
    dateNaissance: new Date('1992-11-10'),
    cin: 'EF345678',
    comptes: []
  },
  {
    id: 4,
    nom: 'Chen',
    prenom: 'David',
    email: 'david.chen@example.com',
    telephone: '+1 (555) 456-7890',
    identifiant: 'dchen',

    estActif: true,
    dateCreation: new Date('2025-01-20'),
    numeroClient: 1004,
    adresse: '101 Cedar Lane',
    ville: 'Oakville',
    codePostal: '20223',
    pays: 'United States',
    dateNaissance: new Date('1988-03-25'),
    cin: 'GH901234',
    comptes: []
  },
  {
    id: 5,
    nom: 'Patel',
    prenom: 'Priya',
    email: 'priya.patel@example.com',
    telephone: '+1 (555) 567-8901',
    identifiant: 'ppatel',


    estActif: false,
    dateCreation: new Date('2025-02-10'),
    numeroClient: 1005,
    adresse: '222 Birch Road',
    ville: 'Elmwood',
    codePostal: '30334',
    pays: 'United States',
    dateNaissance: new Date('1995-07-18'),
    cin: 'IJ567890',
    comptes: []
  }
];

// Helper function to add a new client to the mock data
export function addClient(client: Client): Client {
  // Make a copy of the client to avoid reference issues
  const newClient: Client = { ...client };

  // Generate a new ID (highest existing ID + 1)
  newClient.id = Math.max(...MOCK_CLIENTS.map(c => c.id || 0)) + 1;

  // Generate a client number (id + 1000)
  newClient.numeroClient = newClient.id + 1000;

  // Add the new client to the array
  MOCK_CLIENTS.unshift(newClient);

  // Return the new client with its assigned ID and client number
  return newClient;
}

// Helper function to update an existing client
export function updateClient(client: Client): Client | null {
  const index = MOCK_CLIENTS.findIndex(c => c.id === client.id);
  if (index !== -1) {
    MOCK_CLIENTS[index] = { ...client };
    return MOCK_CLIENTS[index];
  }
  return null;
}

// Helper function to delete a client
export function deleteClient(id: number): boolean {
  const index = MOCK_CLIENTS.findIndex(c => c.id === id);
  if (index !== -1) {
    MOCK_CLIENTS.splice(index, 1);
    return true;
  }
  return false;
}

// Helper function to get clients with accounts
export function getClientsWithAccounts(): Client[] {
  return MOCK_CLIENTS.filter(client => client.comptes && client.comptes.length > 0);
}

// Helper function to get new clients (last 30 days)
export function getNewClients(): Client[] {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return MOCK_CLIENTS.filter(client =>
    client.dateCreation && client.dateCreation >= thirtyDaysAgo
  );
}
