import { Component, output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../directives/single-click.directive';

@Component({
  selector: 'app-save-cancel',
  templateUrl: './save-cancel.component.html',
  imports: [ButtonDirective, Ripple, SingleClickDirective],
})
export class SaveCancelComponent {
  readonly save = output<'continue' | undefined>();
  readonly cancelForm = output<void>();
}
