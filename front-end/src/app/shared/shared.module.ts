import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelPipe } from './pipes/label.pipe';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { TransactionTypeBaseComponent } from './components/transaction-type-base/transaction-type-base.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LabelPipe, ErrorMessagesComponent, FecDatePipe, TransactionTypeBaseComponent],
  exports: [FecDatePipe, LabelPipe, ErrorMessagesComponent],
})
export class SharedModule {}
