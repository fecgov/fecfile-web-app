import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';

import { SharedModule } from '../shared/shared.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionGroupAComponent } from './transaction-group-a/transaction-group-a.component';
import { TransactionGroupBComponent } from './transaction-group-b/transaction-group-b.component';
import { TransactionGroupCComponent } from './transaction-group-c/transaction-group-c.component';
import { TransactionGroupDComponent } from './transaction-group-d/transaction-group-d.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [
    TransactionContainerComponent,
    TransactionTypePickerComponent,
    TransactionGroupAComponent,
    TransactionGroupBComponent,
    TransactionGroupCComponent,
    TransactionGroupDComponent,
  ],
  imports: [
    AccordionModule,
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
    InputNumberModule,
    CalendarModule,
    ToastModule,
    SharedModule,
  ],
})
export class TransactionsModule {}
