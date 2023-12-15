import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_TYPES, FormType, FormTypes } from 'app/shared/utils/form-type.utils';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
})
export class FormTypeDialogComponent {
  formTypeOptions: FormTypes[] = Array.from(FORM_TYPES, (mapping) => mapping[0]);
  selectedType?: FormTypes;
  @Input() noReports: boolean = true;

  constructor(public router: Router, private changeDetectorRef: ChangeDetectorRef) {}

  goToReportForm(): void {
    this.router.navigateByUrl(this.getFormType(this.selectedType)?.createRoute || '');
  }

  getFormType(type?: FormTypes): FormType | undefined {
    return type ? FORM_TYPES.get(type) : undefined;
  }

  get dropdownButtonText(): string {
    if (this.selectedType) {
      const type = this.getFormType(this.selectedType);
      return `<span class="option"><b>${type?.label}:</b> ${type?.description}</span>`;
    } else {
      return '<span></span>';
    }
  }

  updateSelected(type: FormTypes) {
    this.selectedType = type;
  }
}
