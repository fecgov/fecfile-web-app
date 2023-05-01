import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormType, FORM_TYPES, FormTypes } from 'app/shared/utils/form-type.utils';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
})
export class FormTypeDialogComponent {
  @Input() detailVisible = false;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  formTypeOptions: FormTypes[] = Array.from(FORM_TYPES, (mapping) => mapping[0]);
  selectedType?: FormTypes;
  constructor(public router: Router) {}

  goToReportForm(): void {
    this.router.navigateByUrl(this.getFormType(this.selectedType)?.createRoute || '');
  }

  getFormType(type?: FormTypes): FormType | undefined {
    return type ? FORM_TYPES.get(type) : undefined;
  }

  onHide() {
    this.detailVisibleChange.emit(false);
  }
}
