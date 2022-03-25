import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelPipe } from './pipes/label.pipe';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LabelPipe, ErrorMessagesComponent],
  exports: [LabelPipe, ErrorMessagesComponent],
})
export class SharedModule {}
