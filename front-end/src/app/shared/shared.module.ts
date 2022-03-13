import { NgModule } from '@angular/core';
import { LabelPipe } from './pipes/label.pipe';

@NgModule({
  imports: [],
  declarations: [LabelPipe],
  exports: [LabelPipe],
})
export class SharedModule {}
