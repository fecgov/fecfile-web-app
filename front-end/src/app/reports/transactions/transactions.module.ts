import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'app/shared/shared.module';
import { DoubleTransactionDetailComponent } from './double-transaction-detail/double-transaction-detail.component';
import { TripleTransactionDetailComponent } from './triple-transaction-detail/triple-transaction-detail.component';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { TransactionDisbursementsComponent } from './transaction-list/transaction-disbursements/transaction-disbursements.component';
import { MemoCodePipe, TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionReceiptsComponent } from './transaction-list/transaction-receipts/transaction-receipts.component';
import { TransactionLoansAndDebtsComponent } from './transaction-list/transaction-loans-and-debts/transaction-loans-and-debts.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionInputComponent } from './transaction-input/transaction-input.component';
import { TransactionNavigationComponent } from './transaction-navigation/transaction-navigation.component';
import { TransactionChildrenComponent } from './transaction-list/transaction-children/transaction-children.component';

@NgModule({
  declarations: [
    TransactionContainerComponent,
    TransactionTypePickerComponent,
    TransactionListComponent,
    DoubleTransactionDetailComponent,
    TripleTransactionDetailComponent,
    TransactionDetailComponent,
    MemoCodePipe,
    TransactionReceiptsComponent,
    TransactionChildrenComponent,
    TransactionDisbursementsComponent,
    TransactionLoansAndDebtsComponent,
    TransactionInputComponent,
    TransactionNavigationComponent,
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
