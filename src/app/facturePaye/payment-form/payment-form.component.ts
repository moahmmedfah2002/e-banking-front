import {Component, EventEmitter, Input, NgIterable, Output} from '@angular/core';

@Component({
  selector: 'app-payment-form',
  standalone: false,
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent {
  @Input() provider!: any;
  @Output() paymentSubmitted = new EventEmitter<unknown>();
  paymentData: any;
  paymentMethods: (NgIterable<unknown> & NgIterable<any>) | undefined | null;

  onSubmit() {

  }

  getAccountPlaceholder() {

  }

  toggleRecurringOptions() {

  }
}
