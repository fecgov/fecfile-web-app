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
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';

import { SharedModule } from '../shared/shared.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionGroupAComponent } from './transaction-group-a/transaction-group-a.component';
import { TransactionGroupBComponent } from './transaction-group-b/transaction-group-b.component';
import { TransactionGroupCComponent } from './transaction-group-c/transaction-group-c.component';
import { TransactionGroupDComponent } from './transaction-group-d/transaction-group-d.component';
import { TransactionGroupEComponent } from './transaction-group-e/transaction-group-e.component';
import { TransactionGroupFComponent } from './transaction-group-f/transaction-group-f.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';
import { TransactionListComponent, MemoCodePipe } from './transaction-list/transaction-list.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    TransactionContainerComponent,
    TransactionTypePickerComponent,
    TransactionListComponent,
    MemoCodePipe,
    TransactionGroupAComponent,
    TransactionGroupBComponent,
    TransactionGroupCComponent,
    TransactionGroupDComponent,
    TransactionGroupEComponent,
    TransactionGroupFComponent,
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
    ToolbarModule,
    TableModule,
    SharedModule,
    ConfirmDialogModule,
  ],
})
export class TransactionsModule {}
