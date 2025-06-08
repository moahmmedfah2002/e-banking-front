import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Agent } from '../modele/Agent';
import { Bank } from '../modele/Bank';
import { Role } from '../modele/Role';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
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

  constructor() { }

  getAllAgents(): Observable<Agent[]> {
    return of(this.mockAgents);
  }

  getTotalAgentsCount(): Observable<number> {
    return of(this.mockAgents.length);
  }

  getActiveAgentsCount(): Observable<number> {
    return of(this.mockAgents.filter(agent => agent.estActif).length);
  }

  getSuperAgentsCount(): Observable<number> {
    // For demonstration, let's consider agents with more than 2 clients as 'super agents'
    return of(this.mockAgents.filter(agent => agent.clientIds.length > 2 && agent.estActif).length);
  }

  getInactiveAgentsCount(): Observable<number> {
    return of(this.mockAgents.filter(agent => !agent.estActif).length);
  }

  addAgent(agent: Agent): Observable<Agent> {
    const newAgent = { ...agent };
    newAgent.id = this.mockAgents.length + 1;
    newAgent.dateCreation = new Date();
    this.mockAgents.push(newAgent);
    return of(newAgent);
  }

  deleteAgent(id: number): Observable<void> {
    const index = this.mockAgents.findIndex(agent => agent.id === id);
    if (index !== -1) {
      this.mockAgents.splice(index, 1);
    }
    return of(void 0);
  }

  updateAgent(agent: Agent): Observable<Agent> {
    const index = this.mockAgents.findIndex(a => a.id === agent.id);
    if (index !== -1) {
      this.mockAgents[index] = { ...agent };
    }
    return of(agent);
  }
}
