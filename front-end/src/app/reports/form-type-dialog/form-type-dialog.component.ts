import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormType, FORM_TYPES, FormTypes } from 'app/shared/utils/form-type.utils';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
})
export class FormTypeDialogComponent {
  @Input() visible = false;
  formTypeOptions: FormTypes[] = Array.from(FORM_TYPES, (mapping) => mapping[0]);
  selectedType?: FormTypes;
  constructor(public router: Router) {}

  goToReportForm(): void {
    this.router.navigateByUrl(this.getFormType(this.selectedType)?.createRoute || '');
  }

  getFormType(type?: FormTypes): FormType | undefined {
    return type ? FORM_TYPES.get(type) : undefined;
  }
}
