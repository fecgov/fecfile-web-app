import { inject, Injectable } from '@angular/core';
import { ReportService } from './report.service';
import type { Form24 } from '../models';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class Form24Service extends ReportService<Form24> {
  override apiEndpoint = '/reports/form-24';
}

@Injectable({ providedIn: 'root' })
export class F24UniqueNameValidator implements AsyncValidator {
  protected readonly form24Service = inject(Form24Service);
  async validate(control: AbstractControl): Promise<ValidationErrors | null> {
    if (!control.get('typeName')?.value || !control.get('form24Name')?.value) {
      return {
        required: true,
      };
    }
    const typeName = control.get('typeName')?.value;
    const form24Name = control.get('form24Name')?.value;
    const reports = await this.form24Service.getAllReports();
    const existingNames = reports.map((report) => report?.name?.toLowerCase() ?? '') ?? [];
    const newName = (typeName + form24Name).toLowerCase();
    if (existingNames.includes(newName)) {
      return {
        duplicateName: true,
      };
    }
    return null;
  }
}
