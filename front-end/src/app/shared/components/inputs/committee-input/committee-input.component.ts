import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-committee-input',
  templateUrl: './committee-input.component.html',
})
export class CommitteeInputComponent extends BaseInputComponent {
  @Input() entityRole = 'CONTACT';
  @Input() includeFecId = false;
}
