import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScheduleFormTemplateMapType } from '../../models/transaction.model';
import { ScheduleAFormTemplateMap } from 'app/shared/models/scha-transaction.model';

@Component({
  template: '',
})
export abstract class BaseInputComponent {
  @Input() form: FormGroup = new FormGroup([]);
  @Input() formSubmitted = false;
  @Input() formTemplateMap: ScheduleFormTemplateMapType = ScheduleAFormTemplateMap;
}
