import { Component, computed, input, output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../directives/single-click.directive';
import { buildDataCy } from 'app/shared/utils/data-cy.utils';

@Component({
  selector: 'app-save-cancel',
  templateUrl: './save-cancel.component.html',
  imports: [ButtonDirective, Ripple, SingleClickDirective],
})
export class SaveCancelComponent {
  readonly dataCyContext = input('');
  readonly save = output<'continue' | void>();
  readonly cancelForm = output<void>();
  readonly backButtonDataCy = computed(() => buildDataCy(this.dataCyContext(), 'back', 'button'));
  readonly saveButtonDataCy = computed(() => buildDataCy(this.dataCyContext(), 'save', 'button'));
  readonly saveAndContinueButtonDataCy = computed(() => buildDataCy(this.dataCyContext(), 'save-and-continue', 'button'));
}
