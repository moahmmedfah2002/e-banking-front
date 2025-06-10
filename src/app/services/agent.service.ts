import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Agent } from '../modele/Agent';
import { Bank } from '../modele/Bank';
import { Role } from '../modele/Role';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = `${environment.apiUrl}/api/agent`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Keeping the mock data for fallback during development/testing
  private mockAgents: Agent[] = [
    {
      id: 1,
      nom: 'John',
      prenom: 'Smith',
      email: 'john.smith@example.com',
      telephone: '555-123-4567',
      identifiant: 'jsmith',
      password: 'encrypted',
      role: Role.AGENT,
      dateCreation: new Date('2023-01-15'),
      estActif: true,
      bank: {
        id: '1',
        name: 'First Bank',
        address: '123 Banking St.',
        phone: '555-111-2222',
        email: 'contact@firstbank.com',
        status: 'Active',
        agents: []
      },
      clientIds: ['101', '102', '103']
    },
    {
      id: 2,
      nom: 'Sarah',
      prenom: 'Johnson',
      email: 'sarah.johnson@example.com',
      telephone: '555-234-5678',
      identifiant: 'sjohnson',
      password: 'encrypted',
      role: Role.AGENT,
      dateCreation: new Date('2023-02-20'),
      estActif: true,
      bank: {
        id: '1',
        name: 'First Bank',
        address: '123 Banking St.',
        phone: '555-111-2222',
        email: 'contact@firstbank.com',
        status: 'Active',
        agents: []
      },
      clientIds: ['104', '105']
    },
    {
      id: 3,
      nom: 'Robert',
      prenom: 'Wilson',
      email: 'robert.wilson@example.com',
      telephone: '555-345-6789',
      identifiant: 'rwilson',
      password: 'encrypted',
      role: Role.AGENT,
      dateCreation: new Date('2023-03-25'),
      estActif: true,
      bank: {
        id: '2',
        name: 'Second Bank',
        address: '456 Finance Ave.',
        phone: '555-333-4444',
        email: 'contact@secondbank.com',
        status: 'Active',
        agents: []
      },
      clientIds: ['106', '107', '108']
    },
    {
      id: 4,
      nom: 'Emma',
      prenom: 'Taylor',
      email: 'emma.taylor@example.com',
      telephone: '555-456-7890',
      identifiant: 'etaylor',
      password: 'encrypted',
      role: Role.AGENT,
      dateCreation: new Date('2023-04-10'),
      estActif: true,
      bank: {
        id: '2',
        name: 'Second Bank',
        address: '456 Finance Ave.',
        phone: '555-333-4444',
        email: 'contact@secondbank.com',
        status: 'Active',
        agents: []
      },
      clientIds: ['109']
    },
    {
      id: 5,
      nom: 'Michael',
      prenom: 'Brown',
      email: 'michael.brown@example.com',
      telephone: '555-567-8901',
      identifiant: 'mbrown',
      password: 'encrypted',
      role: Role.AGENT,
      dateCreation: new Date('2023-05-05'),
      estActif: false,
      bank: {
        id: '3',
        name: 'Third Bank',
        address: '789 Money Rd.',
        phone: '555-555-6666',
        email: 'contact@thirdbank.com',
        status: 'Active',
        agents: []
      },
      clientIds: ['110', '111']
    }
  ];
  constructor(private http: HttpClient) { }

  /**
   * Handle HTTP operation errors
   */
  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app continue by returning an empty result
      return throwError(() => error);
    };
  }

  /**
   * GET all agents from the API
   */
  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl)
      .pipe(
        tap(agents => console.log(`Fetched ${agents.length} agents`)),
        catchError(this.handleError('getAllAgents'))
      );
  }

  /**
   * GET total agents count
   */
  getTotalAgentsCount(): Observable<number> {
    return this.getAllAgents().pipe(
      map(agents => agents.length),
      catchError(() => of(this.mockAgents.length)) // Fallback to mock data on error
    );
  }

  /**
   * GET active agents count
   */
  getActiveAgentsCount(): Observable<number> {
    return this.getAllAgents().pipe(
      map(agents => agents.filter(agent => agent.estActif).length),
      catchError(() => of(this.mockAgents.filter(agent => agent.estActif).length))
    );
  }

  /**
   * GET super agents count (agents with more than 2 clients)
   */
  getSuperAgentsCount(): Observable<number> {
    return this.getAllAgents().pipe(
      map(agents => agents.filter(agent => agent.clientIds.length > 2 && agent.estActif).length),
      catchError(() => of(this.mockAgents.filter(agent => agent.clientIds.length > 2 && agent.estActif).length))
    );
  }

  /**
   * GET inactive agents count
   */
  getInactiveAgentsCount(): Observable<number> {
    return this.getAllAgents().pipe(
      map(agents => agents.filter(agent => !agent.estActif).length),
      catchError(() => of(this.mockAgents.filter(agent => !agent.estActif).length))
    );
  }

  /**
   * GET agent by id. Return `undefined` when id not found
   */
  getAgentById(id: number): Observable<Agent | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Agent>(url).pipe(
      tap(agent => console.log(`Fetched agent id=${id}`)),
      catchError(this.handleError(`getAgentById id=${id}`))
    );
  }

  /**
   * POST: add a new agent to the server
   */
  addAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>(this.apiUrl, agent, this.httpOptions).pipe(
      tap(newAgent => console.log(`Added agent w/ id=${newAgent.id}`)),
      catchError(this.handleError('addAgent'))
    );
  }

  /**
   * DELETE: delete the agent from the server
   */
  deleteAgent(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Deleted agent id=${id}`)),
      catchError(this.handleError('deleteAgent'))
    );
  }

  /**
   * PUT: update the agent on the server
   */
  updateAgent(agent: Agent): Observable<Agent> {
    const url = `${this.apiUrl}/${agent.id}`;
    return this.http.put<Agent>(url, agent, this.httpOptions).pipe(
      tap(_ => console.log(`Updated agent id=${agent.id}`)),
      catchError(this.handleError('updateAgent'))
    );
  }

  /**
   * PATCH: activate agent account
   */
  activateAgent(id: number): Observable<Agent> {
    const url = `${this.apiUrl}/${id}/activate`;
    return this.http.patch<Agent>(url, {}, this.httpOptions).pipe(
      tap(_ => console.log(`Activated agent id=${id}`)),
      catchError(this.handleError('activateAgent'))
    );
  }

  /**
   * PATCH: deactivate agent account
   */
  deactivateAgent(id: number): Observable<Agent> {
    const url = `${this.apiUrl}/${id}/deactivate`;
    return this.http.patch<Agent>(url, {}, this.httpOptions).pipe(
      tap(_ => console.log(`Deactivated agent id=${id}`)),
      catchError(this.handleError('deactivateAgent'))
    );
  }
}
