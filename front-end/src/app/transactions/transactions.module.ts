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
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from '../shared/shared.module';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionGroupAComponent } from './transaction-group-a/transaction-group-a.component';
import { TransactionGroupBComponent } from './transaction-group-b/transaction-group-b.component';
import { TransactionGroupCComponent } from './transaction-group-c/transaction-group-c.component';
import { TransactionGroupDComponent } from './transaction-group-d/transaction-group-d.component';
import { TransactionGroupEComponent } from './transaction-group-e/transaction-group-e.component';
import { TransactionGroupIComponent } from './transaction-group-i/transaction-group-i.component';
import { TransactionGroupAgComponent } from './transaction-group-ag/transaction-group-ag.component';
import { TransactionGroupFgComponent } from './transaction-group-fg/transaction-group-fg.component';
import { MemoCodePipe, TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';
import { TransactionsRoutingModule } from './transactions-routing.module';

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
    TransactionGroupIComponent,
    TransactionGroupAgComponent,
    TransactionGroupFgComponent,
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
    OverlayPanelModule,
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
