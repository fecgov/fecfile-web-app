import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'app/shared/shared.module';
import { F24RoutingModule } from './f24-routing.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TransactionIndependentExpenditurePickerComponent } from './transaction-independent-expenditure-picker/transaction-independent-expenditure-picker.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    F24RoutingModule,
    SharedModule,
    ConfirmDialogModule,
    DividerModule,
    DropdownModule,
    CardModule,
    InputTextareaModule,
    InputTextModule,
  ],
  declarations: [TransactionIndependentExpenditurePickerComponent],
})
export class F24Module {}
