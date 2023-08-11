import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { TemplateMapKeyType } from 'app/shared/models/transaction-type.model';

@Component({
  selector: 'app-committee-input',
  templateUrl: './committee-input.component.html',
  styleUrls: ['./committee-input.component.scss'],
})
export class CommitteeInputComponent extends BaseInputComponent {
  @Input() entityRole = 'CONTACT';
  @Input() includeFecId = false;
  @Input() readonly = false;
  @Input() nameField: TemplateMapKeyType = 'organization_name';
}
