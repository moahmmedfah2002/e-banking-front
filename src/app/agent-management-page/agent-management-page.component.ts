import { Component, OnInit } from '@angular/core';
import { AgentService } from '../services/agent.service';
import { Agent } from '../modele/Agent';

@Component({
  selector: 'app-agent-management-page',
  standalone: false,
  templateUrl: './agent-management-page.component.html',
  styleUrl: './agent-management-page.component.css'
})
export class AgentManagementPageComponent implements OnInit {
  agents: Agent[] = [];
  filteredAgents: Agent[] = [];
  totalAgents: number = 0;
  activeAgents: number = 0;
  superAgents: number = 0;
  inactiveAgents: number = 0;
  searchQuery: string = '';
  selectedSort: string = 'Name';
  
  // Mock values for percentage changes
  totalChangePercent: number = 2;
  activeChangePercent: number = 1;
  inactiveChangePercent: number = 0;

  constructor(private agentService: AgentService) { }

  ngOnInit(): void {
    this.loadAgents();
    this.loadCounts();
  }

  loadAgents(): void {
    this.agentService.getAllAgents().subscribe(agents => {
      this.agents = agents;
      this.filteredAgents = this.agents;
      this.applySort();
    });
  }

  loadCounts(): void {
    this.agentService.getTotalAgentsCount().subscribe(count => this.totalAgents = count);
    this.agentService.getActiveAgentsCount().subscribe(count => this.activeAgents = count);
    this.agentService.getSuperAgentsCount().subscribe(count => this.superAgents = count);
    this.agentService.getInactiveAgentsCount().subscribe(count => this.inactiveAgents = count);
  }

  searchAgents(): void {
    if (!this.searchQuery.trim()) {
      this.filteredAgents = this.agents;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredAgents = this.agents.filter(agent => 
        agent.nom?.toLowerCase().includes(query) || 
        agent.prenom?.toLowerCase().includes(query) || 
        agent.email?.toLowerCase().includes(query)
      );
    }
    this.applySort();
  }

  applySort(): void {
    switch (this.selectedSort) {
      case 'Name':
        this.filteredAgents.sort((a, b) => {
          const fullNameA = `${a.prenom} ${a.nom}`.toLowerCase();
          const fullNameB = `${b.prenom} ${b.nom}`.toLowerCase();
          return fullNameA.localeCompare(fullNameB);
        });
        break;
      case 'DateCreated':
        this.filteredAgents.sort((a, b) => {
          return new Date(b.dateCreation!).getTime() - new Date(a.dateCreation!).getTime();
        });
        break;
      case 'Status':
        this.filteredAgents.sort((a, b) => {
          if (a.estActif === b.estActif) return 0;
          return a.estActif ? -1 : 1;
        });
        break;
      default:
        break;
    }
  }

  sortBy(sortOption: string): void {
    this.selectedSort = sortOption;
    this.applySort();
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    
    const now = new Date();
    const diff = Math.abs(now.getTime() - new Date(date).getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today, ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday, ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return days + ' days ago';
    } else if (days < 14) {
      return '1 week ago';
    } else if (days < 30) {
      return Math.floor(days / 7) + ' weeks ago';
    } else {
      return new Date(date).toLocaleDateString();
    }
  }

  getAgentInitials(agent: Agent): string {
    if (!agent.prenom || !agent.nom) return '';
    return (agent.prenom[0] + agent.nom[0]).toUpperCase();
  }

  addNewAgent(): void {
    // This would typically open a modal or navigate to an add agent page
    console.log('Adding new agent');
  }

  editAgent(agent: Agent): void {
    console.log('Editing agent:', agent);
  }

  deleteAgent(agent: Agent): void {
    if (confirm(`Are you sure you want to delete ${agent.prenom} ${agent.nom}?`)) {
      this.agentService.deleteAgent(agent.id!).subscribe(() => {
        this.loadAgents();
        this.loadCounts();
      });
    }
  }

  getAgentRole(agent: Agent): string {
    if (agent.clientIds.length > 2) return 'Super Agent';
    return 'Agent';
  }
}
