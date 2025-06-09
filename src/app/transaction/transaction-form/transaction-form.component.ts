import {Component, inject, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {User} from '../../modele/User';
import {ViremntService} from '../../services/viremntService';

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit {
  public virement:ViremntService=inject(ViremntService);
  @Input()
  public client?: User;
  public status?:boolean;
  public msg?:string;
  activeTab: string = 'transfer';
  private dialog: MatDialog=inject(MatDialog)
  // Form groups for different transaction types
  transferForm!: FormGroup;
  payBillForm!: FormGroup;
  mobileDepositForm!: FormGroup;

  // Properties for form handling
  recipientType: string = 'my-account';
  scheduledTransfer: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    // Initialize Transfer Money form
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      recipientType: ['my-account', Validators.required],
      toMyAccount: ['', Validators.required],
      recipientName: [''],
      recipientAccountNumber: [''],
      bankName: [''],
      routingNumber: [''],
      externalAccountNumber: [''],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transferTime: ['now', Validators.required],
      scheduleDate: [''],
      note: ['']
    });


    // Initialize Pay Bills form
    this.payBillForm = this.fb.group({
      fromAccount: ['', Validators.required],
      payee: ['', Validators.required],
      accountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      paymentDate: ['now', Validators.required],
      scheduleDate: [''],
      memo: ['']
    });

    // Initialize Mobile Deposit form
    this.mobileDepositForm = this.fb.group({
      toAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      frontImage: [null, Validators.required],
      backImage: [null, Validators.required],
      memo: ['']
    });

    // Set up form value change listeners
    this.setUpFormListeners();
  }

  setUpFormListeners(): void {
    // Listen for recipient type changes
    this.transferForm.get('recipientType')?.valueChanges.subscribe(value => {
      this.recipientType = value;
      this.updateValidators();
    });

    // Listen for transfer time changes
    this.transferForm.get('transferTime')?.valueChanges.subscribe(value => {
      this.scheduledTransfer = value === 'schedule';
      this.updateDateValidator();
    });

    // Listen for bill payment date changes
    this.payBillForm.get('paymentDate')?.valueChanges.subscribe(value => {
      this.scheduledTransfer = value === 'schedule';
      this.updateBillDateValidator();
    });
  }

  updateValidators(): void {
    // Clear validators first
    this.transferForm.get('toMyAccount')?.clearValidators();
    this.transferForm.get('recipientName')?.clearValidators();
    this.transferForm.get('recipientAccountNumber')?.clearValidators();
    this.transferForm.get('bankName')?.clearValidators();
    this.transferForm.get('routingNumber')?.clearValidators();
    this.transferForm.get('externalAccountNumber')?.clearValidators();

    // Apply validators based on recipient type
    switch (this.recipientType) {
      case 'my-account':
        this.transferForm.get('toMyAccount')?.setValidators([Validators.required]);
        break;
      case 'other-account':
        this.transferForm.get('recipientName')?.setValidators([Validators.required]);
        this.transferForm.get('recipientAccountNumber')?.setValidators([Validators.required]);
        break;
      case 'external':
        this.transferForm.get('bankName')?.setValidators([Validators.required]);
        this.transferForm.get('routingNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{9}$/)]);
        this.transferForm.get('externalAccountNumber')?.setValidators([Validators.required]);
        break;
    }

    // Update validators
    this.transferForm.get('toMyAccount')?.updateValueAndValidity();
    this.transferForm.get('recipientName')?.updateValueAndValidity();
    this.transferForm.get('recipientAccountNumber')?.updateValueAndValidity();
    this.transferForm.get('bankName')?.updateValueAndValidity();
    this.transferForm.get('routingNumber')?.updateValueAndValidity();
    this.transferForm.get('externalAccountNumber')?.updateValueAndValidity();
  }

  updateDateValidator(): void {
    if (this.scheduledTransfer) {
      this.transferForm.get('scheduleDate')?.setValidators([Validators.required]);
    } else {
      this.transferForm.get('scheduleDate')?.clearValidators();
    }
    this.transferForm.get('scheduleDate')?.updateValueAndValidity();
  }

  updateBillDateValidator(): void {
    if (this.scheduledTransfer) {
      this.payBillForm.get('scheduleDate')?.setValidators([Validators.required]);
    } else {
      this.payBillForm.get('scheduleDate')?.clearValidators();
    }
    this.payBillForm.get('scheduleDate')?.updateValueAndValidity();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  onTransferSubmit(): void {
    if (this.transferForm.valid) {
      console.log('Transfer form submitted:', this.transferForm.value);
      // Here you would call a service to process the transfer
      alert('Transfer initiated successfully!');
      this.transferForm.reset({
        recipientType: 'my-account',
        transferTime: 'now'
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.transferForm);
    }
  }

  onPayBillSubmit(): void {
    if (this.payBillForm.valid) {
      console.log('Pay bill form submitted:', this.payBillForm.value);
      // Here you would call a service to process the bill payment
      alert('Bill payment scheduled successfully!');
      this.payBillForm.reset({
        paymentDate: 'now'
      });
    } else {
      this.markFormGroupTouched(this.payBillForm);
    }
  }

  onMobileDepositSubmit(): void {
    if (this.mobileDepositForm.valid) {
      console.log('Mobile deposit form submitted:', this.mobileDepositForm.value);
      // Here you would call a service to process the mobile deposit
      alert('Mobile deposit submitted successfully!');
      this.mobileDepositForm.reset();
    } else {
      this.markFormGroupTouched(this.mobileDepositForm);
    }
  }

  // Helper method to mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  // File input handlers for mobile deposit
  onFrontImageSelected(event: any): void {
    const file = event?.target?.files?.[0];
    if (file) {
      this.mobileDepositForm.patchValue({
        frontImage: file
      });
    }
  }

  strip(){
    this.virement.viremntStrip(this.transferForm.get("accountDebit")?.value,this.transferForm.get("amount")?.value)
  }
  virementAccount(){
    this.virement.viremntAccount(this.transferForm.get("accountDebit")?.value,this.transferForm.get("toMyAccount")?.value,this.transferForm.get("amount")?.value,this.transferForm.get("note"))
      .subscribe(
        {

          next: (msg) => {
            // Show popup with message
            this.dialog.open(MessagePopupComponent, {
              data: { message: msg }
            });
          },
          error: (error) => {
            this.dialog.open(MessagePopupComponent, {
              data: { message: error.error.message }
            });


        }}
      )
  }
  onBackImageSelected(event: any): void {
    const file = event?.target?.files?.[0];
    if (file) {
      this.mobileDepositForm.patchValue({
        backImage: file
      });
    }
  }
}
