import { Component, input, output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../directives/single-click.directive';

@Component({
  selector: 'app-save-cancel',
  templateUrl: './save-cancel.component.html',
  imports: [ButtonDirective, Ripple, SingleClickDirective],
})
export class SaveCancelComponent {
  readonly includeSave = input(true);
  readonly submitDisabled = input(false);
  readonly backLabel = input('Back');
  readonly save = output<'continue' | void>();
  readonly cancelForm = output<void>();
}
