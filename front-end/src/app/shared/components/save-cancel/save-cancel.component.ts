import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../directives/single-click.directive';

@Component({
  selector: 'app-save-cancel',
  templateUrl: './save-cancel.component.html',
  imports: [ButtonDirective, Ripple, SingleClickDirective],
})
export class SaveCancelComponent {
  @Output() save = new EventEmitter<'continue' | undefined>();
  @Output() cancelForm = new EventEmitter();
}
