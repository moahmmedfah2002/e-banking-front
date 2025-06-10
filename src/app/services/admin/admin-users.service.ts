import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../modele/User';
import { Client } from '../../modele/Client';
import { MOCK_CLIENTS } from '../../modele/mock-clients';
import { Role } from '../../modele/Role';
import { Auth } from '../../modele/Auth';

export interface UserStats {
  totalUsers: number;
  totalIncrease: number;
  activeUsers: number;
  activeIncrease: number;
  adminsAndManagers: number;
  adminsChange: string;
  flaggedAccounts: number;
  flaggedIncrease: number;
}

export interface UserFilters {
  role?: string;
  status?: string;
  searchTerm?: string;
  hasAccounts?: boolean;
  newClient?: boolean;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

    getUsers(): Observable<Client[]> {
    let url = `${this.apiUrl}/api/clients`;
       
    return this.http.get<Client[]>(url,{
        headers: {Authorization: `Bearer ${sessionStorage.getItem('authToken')}`},
    }).pipe(
      map(response => {
        // Handle if response is wrapped in a data property
        const data = response;
        console.log('API response:', data);        
        if (!Array.isArray(data)) {
          console.warn('API response is not an array:', data);
          return [];
        }
        // Map each item to the Client type
        return data.map((item:Client) => {
          return {
            id: item.id,
            nom: item.nom,
            prenom: item.prenom,
            email: item.email,
            telephone: item.telephone,
            identifiant: item.identifiant || '',
            password: item.password || '',
            role: Role.CLIENT, // Ensure clients always have the CLIENT role
            dateCreation: new Date(item.dateCreation || ""),
            estActif: item.estActif || true,
            // Client specific properties
            numeroClient: item.numeroClient || 0,
            adresse: item.adresse || '',
            ville: item.ville || '',
            codePostal: item.codePostal || '',
            pays: item.pays || '',
            dateNaissance: new Date(item.dateNaissance ||new Date()),
            cin: item.cin,
            comptes: item.comptes || []
          } as Client;
        });
      }),
      catchError(this.handleError<Client[]>('getUsers', []))
    );
  } 
  getUserById(id: number): Observable<Client> {
    const url = `${this.apiUrl}/admin/users/${id}`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      const mockClient = MOCK_CLIENTS.find(client => client.id === id);
      return of(mockClient || {} as Client);
    }
    
    return this.http.get<any>(url).pipe(
      map((data: any) => {
        // Map API response to Client type
        const client: Client = {
          id: data.id,
          nom: data.lastName || data.nom,
          prenom: data.firstName || data.prenom,
          email: data.email,
          telephone: data.phoneNumber || data.telephone,
          identifiant: data.username || data.identifiant || '',
          password: data.password || '',
          role: data.role,
          dateCreation: new Date(data.createdAt || data.dateCreation),
          estActif: data.status === 'active' || data.estActif,
          // Client specific properties
          numeroClient: data.numeroClient || 0,
          adresse: data.adresse || data.address || '',
          ville: data.ville || data.city || '',
          codePostal: data.codePostal || data.postalCode || '',
          pays: data.pays || data.country || '',
          dateNaissance: new Date(data.dateNaissance || data.birthDate || new Date()),
          cin: data.cin || data.idNumber || '',
          comptes: data.comptes || data.accounts || []
        };
        return client;
      }),
      catchError(this.handleError<Client>('getUserById', {} as Client))
    );
  }

  createUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/admin/users`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      user.id = Math.max(...MOCK_CLIENTS.map(client => client.id || 0)) + 1;
      MOCK_CLIENTS.push(user as unknown as Client);
      return of(user);
    }
    
    return this.http.post<User>(url, user).pipe(
      catchError(this.handleError<User>('createUser', user))
    );
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/admin/users/${user.id}`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      const index = MOCK_CLIENTS.findIndex(client => client.id === user.id);
      if (index !== -1) {
        MOCK_CLIENTS[index] = { ...MOCK_CLIENTS[index], ...user } as unknown as Client;
      }
      return of(user);
    }
    
    return this.http.put<User>(url, user).pipe(
      catchError(this.handleError<User>('updateUser', user))
    );
  }

  deleteUser(id: number): Observable<void> {
    const url = `${this.apiUrl}/admin/users/${id}`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      const index = MOCK_CLIENTS.findIndex(client => client.id === id);
      if (index !== -1) {
        MOCK_CLIENTS.splice(index, 1);
      }
      return of(undefined);
    }
    
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<void>('deleteUser'))
    );
  }

  // Client-specific methods
  getClients(): Observable<Client[]> {
    return this.getUsers();
  }

  getClientById(id: number): Observable<Client> {
    return this.getUserById(id);
  }

  createClient(client: Client): Observable<Client> {
    // Ensure client has the CLIENT role
    client.role = Role.CLIENT;
    return this.http.post<Client>(`${this.apiUrl}/api/clients`, client, {
      headers: {Authorization: `Bearer ${sessionStorage.getItem('authToken')}`}
    }).pipe(
      catchError(this.handleError<Client>('createClient', client))
    );
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/api/clients/${client.id}`, client, {
      headers: {Authorization: `Bearer ${sessionStorage.getItem('authToken')}`}
    }).pipe(
      catchError(this.handleError<Client>('updateClient', client))
    );
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/clients/${id}`, {
      headers: {Authorization: `Bearer ${sessionStorage.getItem('authToken')}`}
    }).pipe(
      catchError(this.handleError<void>('deleteClient'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
