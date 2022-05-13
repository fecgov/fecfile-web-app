import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';

import { SharedModule } from '../../app/shared/shared.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionGroupBComponent } from './transaction-group-b/transaction-group-b.component';

@NgModule({
  declarations: [TransactionContainerComponent, TransactionGroupBComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TransactionsRoutingModule,
    ButtonModule,
    DividerModule,
    DropdownModule,
    CheckboxModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    ToastModule,
    SharedModule,
  ],
})
export class TransactionsModule {}
