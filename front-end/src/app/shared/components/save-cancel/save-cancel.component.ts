import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-save-cancel',
  templateUrl: './save-cancel.component.html',
})
export class SaveCancelComponent {
  @Output() save = new EventEmitter<'continue' | undefined>();
  @Output() cancelForm = new EventEmitter();
}
