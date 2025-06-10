import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AgentService } from '../services/agent.service';
import { BankService } from '../services/bank.service';
import { Agent } from '../modele/Agent';
import { Role } from '../modele/Role';
import { Bank } from '../modele/Bank';
import { finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
    // Agent form properties
  isAgentModalVisible: boolean = false;
  agentForm!: FormGroup;
  isEditMode: boolean = false;
  editAgentId: number | undefined;
  banks: Bank[] = [];
  isFormSubmitting: boolean = false;
  
  // Alert properties
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';
  alertTimeout: any;
  
  // Mock values for percentage changes
  totalChangePercent: number = 2;
  activeChangePercent: number = 1;
  inactiveChangePercent: number = 0;
  
  constructor(
    private agentService: AgentService, 
    private bankService: BankService,
    private fb: FormBuilder
  ) {
    this.initializeAgentForm();
  }
  ngOnInit(): void {
    this.loadAgents();
    this.loadCounts();
    this.loadBanks();
  }
  
  // Phone number validator
  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    
    // Allow formats like: (123) 456-7890 or 123-456-7890 or 1234567890
    const phoneRegex = /^(\+\d{1,3}\s?)?((\(\d{3}\))|(\d{3}))[-\s]?\d{3}[-\s]?\d{4}$/;
    return phoneRegex.test(value) ? null : { invalidPhone: true };
  }
  
  private initializeAgentForm(): void {
    this.agentForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, this.phoneValidator]],
      identifiant: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      bankId: ['', Validators.required],
      estActif: [true]
    });
  }
    private loadBanks(): void {
    this.bankService.getAllBanks().subscribe({
      next: (banks) => {
        this.banks = banks;
      },
      error: (error) => {
        console.error('Error loading banks:', error);
        this.showAlert('Failed to load bank list. Please try again later.', 'error');
      }
    });
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
  }  addNewAgent(): void {
    this.isEditMode = false;
    this.editAgentId = undefined;
    this.resetAgentForm();
    this.toggleAgentModal();
  }

  editAgent(agent: Agent): void {
    this.isEditMode = true;
    this.editAgentId = agent.id;
    
    // Don't require password in edit mode
    this.agentForm.controls['password'].clearValidators();
    this.agentForm.controls['password'].updateValueAndValidity();
    
    // If we have the full agent details, populate the form
    if (agent.prenom && agent.nom) {
      this.patchAgentForm(agent);
    } else if (agent.id) {
      // If we only have the ID, fetch the full agent details first
      this.agentService.getAgentById(agent.id).subscribe({
        next: (fullAgent) => {
          if (fullAgent) {
            this.patchAgentForm(fullAgent);
          } else {
            this.showAlert('Agent details not found', 'error');
          }
        },
        error: (error) => {
          this.showAlert(`Error fetching agent details: ${error.message}`, 'error');
        }
      });
    }
    
    this.toggleAgentModal();
  }
  
  private patchAgentForm(agent: Agent): void {
    this.agentForm.patchValue({
      prenom: agent.prenom,
      nom: agent.nom,
      email: agent.email,
      telephone: agent.telephone,
      identifiant: agent.identifiant,
      bankId: agent.bank?.id,
      estActif: agent.estActif
    });
  }
  
  toggleAgentModal(): void {
    this.isAgentModalVisible = !this.isAgentModalVisible;
    if (!this.isAgentModalVisible) {
      this.resetAgentForm();
      this.isEditMode = false;
      this.editAgentId = undefined;
    } else if (!this.isEditMode) {
      // Reset validators for password - required in create mode
      this.agentForm.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
      this.agentForm.controls['password'].updateValueAndValidity();
    }
  }
  
  resetAgentForm(): void {
    this.agentForm.reset({estActif: true});
  }
  onAgentSubmit(): void {
    if (this.agentForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.agentForm.controls).forEach(key => {
        this.agentForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    if (this.isFormSubmitting) {
      return; // Prevent multiple submissions
    }
    
    this.isFormSubmitting = true;
    const formValues = this.agentForm.value;
    
    // Find the selected bank to get its details
    const selectedBank = this.banks.find(bank => bank.id === formValues.bankId);
    
    if (this.isEditMode && this.editAgentId) {
      // Get the existing agent first to preserve certain fields
      this.agentService.getAgentById(this.editAgentId).subscribe({
        next: (existingAgent) => {
          if (!existingAgent) {
            this.showAlert('Agent not found', 'error');
            this.isFormSubmitting = false;
            return;
          }
          
          // Update existing agent
          const updatedAgent: Agent = {
            id: this.editAgentId,
            prenom: formValues.prenom,
            nom: formValues.nom,
            email: formValues.email,
            telephone: formValues.telephone,
            identifiant: formValues.identifiant,
            password: formValues.password || existingAgent.password,
            role: Role.AGENT,
            estActif: formValues.estActif,
            dateCreation: existingAgent.dateCreation, // Preserve original creation date
            bank: {
              id: formValues.bankId,
              name: selectedBank?.name || '',
              address: selectedBank?.address || '',
              phone: selectedBank?.phone || '',
              email: selectedBank?.email || '',
              status: selectedBank?.status || 'Active',
              agents: []
            },
            clientIds: existingAgent.clientIds // Preserve client ids
          };
          
          this.agentService.updateAgent(updatedAgent)
            .pipe(
              finalize(() => this.isFormSubmitting = false),
              catchError(error => {
                const errorMsg = error.message || 'An unknown error occurred';
                this.showAlert(`Error updating agent: ${errorMsg}`, 'error');
                return of(null);
              })
            )
            .subscribe({
              next: (agent) => {
                if (agent) {
                  this.showAlert(`Agent ${agent.prenom} ${agent.nom} updated successfully`, 'success');
                  this.loadAgents();
                  this.loadCounts();
                  this.toggleAgentModal();
                }
              }
            });
        },
        error: (error) => {
          this.isFormSubmitting = false;
          const errorMsg = error.message || 'An unknown error occurred';
          this.showAlert(`Error fetching agent details: ${errorMsg}`, 'error');
        }
      });
    } else {
      // Create new agent
      const newAgent: Agent = {
        prenom: formValues.prenom,
        nom: formValues.nom,
        email: formValues.email,
        telephone: formValues.telephone,
        identifiant: formValues.identifiant,
        password: formValues.password,
        role: Role.AGENT,
        estActif: formValues.estActif,
        dateCreation: new Date(),
        bank: {
          id: formValues.bankId,
          name: selectedBank?.name || '',
          address: selectedBank?.address || '',
          phone: selectedBank?.phone || '',
          email: selectedBank?.email || '',
          status: selectedBank?.status || 'Active',
          agents: []
        },
        clientIds: []
      };
      
      this.agentService.addAgent(newAgent)
        .pipe(
          finalize(() => this.isFormSubmitting = false),
          catchError(error => {
            const errorMsg = error.message || 'An unknown error occurred';
            this.showAlert(`Error creating agent: ${errorMsg}`, 'error');
            return of(null);
          })
        )
        .subscribe({
          next: (agent) => {
            if (agent) {
              this.showAlert(`Agent ${agent.prenom} ${agent.nom} created successfully`, 'success');
              this.loadAgents();
              this.loadCounts();
              this.toggleAgentModal();
            }
          }
        });
    }
  }
  deleteAgent(agent: Agent): void {
    if (confirm(`Are you sure you want to delete ${agent.prenom} ${agent.nom}?`)) {
      this.agentService.deleteAgent(agent.id!).subscribe({
        next: () => {
          this.showAlert(`Agent ${agent.prenom} ${agent.nom} deleted successfully`, 'success');
          this.loadAgents();
          this.loadCounts();
        },
        error: (error) => {
          const errorMsg = error.message || 'An unknown error occurred';
          this.showAlert(`Error deleting agent: ${errorMsg}`, 'error');
        }
      });
    }
  }
  getAgentRole(agent: Agent): string {
    if (agent.clientIds.length > 2) return 'Super Agent';
    return 'Agent';
  }
  
  /**
   * Activate an agent using the API endpoint
   */
  activateAgent(agent: Agent): void {
    this.agentService.activateAgent(agent.id!).subscribe({
      next: (updatedAgent) => {
        this.showAlert(`Agent ${updatedAgent.prenom} ${updatedAgent.nom} activated successfully`, 'success');
        this.loadAgents();
        this.loadCounts();
      },
      error: (error) => {
        const errorMsg = error.message || 'An unknown error occurred';
        this.showAlert(`Error activating agent: ${errorMsg}`, 'error');
      }
    });
  }
  
  /**
   * Deactivate an agent using the API endpoint
   */
  deactivateAgent(agent: Agent): void {
    this.agentService.deactivateAgent(agent.id!).subscribe({
      next: (updatedAgent) => {
        this.showAlert(`Agent ${updatedAgent.prenom} ${updatedAgent.nom} deactivated successfully`, 'success');
        this.loadAgents();
        this.loadCounts();
      },
      error: (error) => {
        const errorMsg = error.message || 'An unknown error occurred';
        this.showAlert(`Error deactivating agent: ${errorMsg}`, 'error');
      }
    });
  }
  
  showAlert(message: string, type: 'success' | 'error' = 'success', duration: number = 5000): void {
    this.alertMessage = message;
    this.alertType = type;
    
    // Clear any existing timeout
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    
    // Auto-hide the alert after the specified duration
    this.alertTimeout = setTimeout(() => {
      this.closeAlert();
    }, duration);
  }
  
  closeAlert(): void {
    this.alertMessage = null;
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
      this.alertTimeout = undefined;
    }
  }
}
