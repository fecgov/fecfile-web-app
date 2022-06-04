import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelPipe } from './pipes/label.pipe';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecDatePipe } from './pipes/fec-date.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [LabelPipe, ErrorMessagesComponent, FecDatePipe],
  exports: [FecDatePipe, LabelPipe, ErrorMessagesComponent],
})
export class SharedModule {}
