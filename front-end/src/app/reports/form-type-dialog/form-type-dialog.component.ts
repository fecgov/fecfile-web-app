import { Component, computed, inject, model, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormType, getFormTypes } from 'app/shared/utils/form-type.utils';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { environment } from 'environments/environment';
import { Form24, ReportTypes, Type24_48 } from 'app/shared/models';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { apply, form, FormField, hidden, required, submit } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/schema.utils';
import { SelectButton } from 'primeng/selectbutton';
import { InputGroup } from 'primeng/inputgroup';
import { Form24Service } from 'app/shared/services/form-24.service';
import { form24Options } from 'app/shared/utils/label.utils';
import { defaultForm24Data, f24Schema, Form24Data } from '../f24/form-24-edit/form-24-edit.component';
import { derivedAsync } from 'ngxtension/derived-async';
import { effectOnceIf } from 'ngxtension/effect-once-if';

interface ReportFormData {
  type: ReportTypes | '';
  f24: Form24Data;
}

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
  imports: [ButtonModule, SelectModule, DialogComponent, FormField, SelectButton, InputGroup],
})
export class FormTypeDialogComponent {
  readonly messageService = inject(MessageService);
  readonly router = inject(Router);
  readonly store = inject(Store);
  private readonly form24Service = inject(Form24Service);
  readonly formTypeOptions: ReportTypes[] = Array.from(getFormTypes(environment.showForm3), (mapping) => mapping[0]);
  readonly filteredOptions: Signal<ReportTypes[]> = computed(() =>
    this.formTypeOptions.filter((type) => this.eligibleReportTypes().has(type)),
  );

  readonly dialogVisible = model(false);
  readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);

  readonly reportFormModel = signal<ReportFormData>({ type: '', f24: defaultForm24Data });
  readonly reportForm = form(this.reportFormModel, (schemaPath) => {
    required(schemaPath.type, { message: requiredMessage });
    hidden(schemaPath.f24, ({ valueOf }) => valueOf(schemaPath.type) !== ReportTypes.F24);
    apply(schemaPath.f24, f24Schema);
  });

  readonly eligibleReportTypes = computed(() => {
    const eligible_report_types = this.committeeAccount().eligible_report_types;
    if (!eligible_report_types) {
      console.error('No eligible report types in committee data');
    }
    return new Set(eligible_report_types);
  });

  readonly form24Options = form24Options;
  readonly typeHour = computed(() => `${this.reportForm.f24.type().value()}-Hour:`);
  private readonly fullName = computed(() => `${this.typeHour()} ${this.reportForm.f24.typelessName().value()}`);
  readonly formType = computed(() => this.getFormType(this.reportForm.type().value()));
  private readonly form24Names = derivedAsync(
    async () => {
      const reports = await this.form24Service.getAllReports();
      return new Set<string>(reports.map((r) => r.name!));
    },
    { initialValue: new Set<string>() },
  );

  constructor() {
    effectOnceIf(
      () => this.form24Names(),
      (names) => this.reportForm.f24.existingNames().value.set(names),
    );
  }

  protected submitForm() {
    return submit(this.reportForm, {
      action: async () => {
        try {
          const type = this.reportForm.type().value();
          if (type === ReportTypes.F24) {
            const form24 = Form24.fromJSON({
              name: this.fullName(),
              report_type_24_48: this.reportForm.f24.type().value(),
              street_1: this.committeeAccount().street_1,
              street_2: this.committeeAccount().street_2,
              city: this.committeeAccount().city,
              state: this.committeeAccount().state,
              zip: this.committeeAccount().zip,
              filer_committee_id_number: this.committeeAccount().committee_id,
              committee_name: this.committeeAccount().name,
            });
            const report = await this.form24Service.create(form24, ['report_type_24_48']);
            this.router.navigateByUrl(`/reports/transactions/report/${report.id}/list`);
          } else {
            this.router.navigateByUrl(`/reports/${type.toLowerCase()}/create`);
          }
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error creating this Form 24',
            life: 3000,
          });
        }
      },
    });
  }

  getFormType(type?: ReportTypes | ''): FormType | undefined {
    return type === undefined || type === '' ? undefined : getFormTypes(environment.showForm3).get(type as ReportTypes);
  }
}
