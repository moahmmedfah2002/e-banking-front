import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Client } from '../../../modele/Client';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AgentClientService {
  private baseApiUrl = environment.apiUrl ? environment.apiUrl : '/api';
  private agentUrl = `${this.baseApiUrl}/agent`;
  private agentId: number | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    // Get the agent ID from the user in session storage
    this.loadAgentId();
  }

  /**
   * Load the agent ID from session storage
   */
  private loadAgentId(): void {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.agentId = user.id;
      } catch (e) {
        console.error('Failed to parse user data from session storage', e);
      }
    }
  }

  /**
   * Get all clients managed by this agent
   * @returns Observable of Client array
   */
  getClients(): Observable<Client[]> {
    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }

    return this.http.get<Client[]>(`${this.agentUrl}/${this.agentId}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(clients => console.log(`Fetched ${clients.length} clients`)),
      catchError(this.handleError<Client[]>('getClients', []))
    );
  }

  /**
   * Get a single client by ID
   * @param id Client ID
   * @returns Observable of Client
   */
  getClient(id: number): Observable<Client> {
    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }

    return this.http.get<Client>(`${this.agentUrl}/${this.agentId}/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Fetched client id=${id}`)),
      catchError(this.handleError<Client>(`getClient id=${id}`))
    );
  }

  /**
   * Add a new client
   * @param client Client data to add
   * @returns Observable of created Client
   */
  addClient(client: Client): Observable<Client> {
    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }

    return this.http.post<Client>(`${this.agentUrl}/${this.agentId}/clients`, client, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap((newClient: Client) => console.log(`Added client w/ id=${newClient.id}`)),
      catchError(this.handleError<Client>('addClient'))
    );
  }

  /**
   * Update an existing client
   * @param client Client data to update
   * @returns Observable of updated Client
   */
  updateClient(client: Client): Observable<Client> {
    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }

    return this.http.put<Client>(`${this.agentUrl}/${this.agentId}/clients/${client.id}`, client, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Updated client id=${client.id}`)),
      catchError(this.handleError<Client>('updateClient'))
    );
  }

  /**
   * Delete a client
   * @param id Client ID to delete
   * @returns Observable of void
   */
  deleteClient(id: number): Observable<void> {
    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }

    return this.http.delete<void>(`${this.agentUrl}/${this.agentId}/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Deleted client id=${id}`)),
      catchError(this.handleError<void>('deleteClient'))
    );
  }
  /**
   * Search clients by name, email, or account number
   * @param term Search term
   * @returns Observable of Client array
   */
  searchClients(term: string): Observable<Client[]> {
    if (!term.trim()) {
      return this.getClients();
    }

    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }
    
    const params = new HttpParams().set('search', term);
    
    return this.http.get<Client[]>(`${this.agentUrl}/${this.agentId}/clients/search`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    }).pipe(
      tap(clients => console.log(`Found ${clients.length} clients matching "${term}"`)),
      catchError(this.handleError<Client[]>('searchClients', []))
    );
  }

  /**
   * Get statistics about clients
   * @returns Observable with client stats
   */
  getClientStats(): Observable<{
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    newClients: number;
  }> {
    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }
    
    return this.http.get<any>(`${this.agentUrl}/${this.agentId}/clients/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(stats => console.log('Fetched client statistics')),
      catchError(this.handleError<any>('getClientStats', {}))
    );
  }
  
  /**
   * Activate a client account
   * @param id Client ID to activate
   * @returns Observable of Client
   */
  activateClient(id: number): Observable<Client> {
    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }

    return this.http.patch<Client>(`${this.agentUrl}/${this.agentId}/clients/${id}/activate`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Activated client id=${id}`)),
      catchError(this.handleError<Client>('activateClient'))
    );
  }

  /**
   * Deactivate a client account
   * @param id Client ID to deactivate
   * @returns Observable of Client
   */
  deactivateClient(id: number): Observable<Client> {
    const token = this.authService.getToken();
    
    if (!this.agentId) {
      this.loadAgentId();
    }

    return this.http.patch<Client>(`${this.agentUrl}/${this.agentId}/clients/${id}/deactivate`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(_ => console.log(`Deactivated client id=${id}`)),
      catchError(this.handleError<Client>('deactivateClient'))
    );
  }

  /**
   * Handle HTTP operation that failed
   * @param operation Name of the operation that failed
   * @param result Optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app keep running by returning an empty result
      return new Observable<T>(observer => {
        observer.next(result as T);
        observer.complete();
      });
    };
  }
}
