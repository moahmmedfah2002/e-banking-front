import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../modele/Transaction';
import { AgentTransactionService } from '../../../services/agent/agent-transaction.service';

@Component({
  selector: 'app-transaction-agent-form',
  templateUrl: './transaction-form-agent.component.html',
  styleUrls: ['./transaction-form-agent.component.css'],
  standalone: false
})
export class TransactionAgentFormComponent {
  @Output() closeForm = new EventEmitter<void>();
  @Output() transactionCreated = new EventEmitter<Transaction>();
  protected transactionForm: FormGroup;
  loading = false;
  private transactionService = inject(AgentTransactionService);
  // Inject FormBuilder for reactive forms
  
  constructor(private fb: FormBuilder,) {
    this.transactionForm = this.fb.group({
      compteAdebit: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      compteAcredit: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      monet: ['', [Validators.required, Validators.min(0.01)]],
      typeTransaction: ['Sortante', Validators.required],
      notes: ['']
    });
  }
    onSubmit(): void {
    if (this.transactionForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Create transaction object from form
    const transaction: Transaction = {
      id: Math.floor(Math.random() * 1000000) + 100000, // Generate random ID
      ...this.transactionForm.value,
      dateTransaction: new Date(),
    };
    
    // Use the injected service to create the transaction
    this.transactionService.createTransaction(transaction).subscribe({
      next: (createdTransaction) => {
        this.transactionCreated.emit(createdTransaction);
        this.loading = false;
        this.onCancel();
      },
      error: (error) => {
        console.error('Error creating transaction:', error);
        this.loading = false;
      }
    });
  }
    onCancel(): void {
    this.closeForm.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Only close if they clicked directly on the backdrop, not on the modal content
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onCancel();
    }
  }
}
