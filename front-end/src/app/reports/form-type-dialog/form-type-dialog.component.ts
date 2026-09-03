import { Component, computed, inject, model, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormType, getFormTypes } from 'app/shared/utils/form-type.utils';
import { MessageService } from 'primeng/api';
import { environment } from 'environments/environment';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { apply, form, FormField, hidden, required, submit } from '@angular/forms/signals';
import { Form24Service } from 'app/shared/services/form-24.service';
import { form24Options } from 'app/shared/utils/label.utils';
import { derivedAsync } from 'ngxtension/derived-async';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { buildF24Name, Form24, Form24Data, form24Schema } from 'app/shared/models/reports/form-24.model';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { SelectButtonInput } from 'app/shared/components/signal-inputs/select-button-input/select-button.input';
import { SelectInput } from 'app/shared/components/signal-inputs/select-input/select.input';
import { InputGroupInput } from 'app/shared/components/signal-inputs/input-group/input-group.input';
import { CommitteeStore } from 'app/committee/committee.store';

interface ReportFormData {
  type: ReportTypes | '';
  f24: Form24Data;
}

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
  imports: [DialogComponent, FormField, SelectButtonInput, SelectInput, InputGroupInput],
})
export class FormTypeDialogComponent {
  private readonly committeeStore = inject(CommitteeStore);
  readonly form24Options = form24Options;
  readonly messageService = inject(MessageService);
  readonly router = inject(Router);
  private readonly form24Service = inject(Form24Service);
  readonly formTypeOptions = Array.from(getFormTypes(environment.showForm3), (mapping) => mapping[1]);
  readonly filteredOptions = computed(() => {
    const options = this.formTypeOptions.filter((type) => this.committeeStore.eligibleReportTypes().has(type.code));

    return options.map((option) => {
      return {
        label: option.label,
        description: option.description,
        value: option.code,
      };
    });
  });

  readonly dialogVisible = model(false);

  private readonly form24Names = derivedAsync(
    async () => {
      const reports = await this.form24Service.getAllReports();
      return new Set<string>(reports.map((r) => r.name!));
    },
    { initialValue: new Set<string>() },
  );

  readonly reportFormModel = signal<ReportFormData>({ type: '', f24: { type: null, typelessName: '' } });
  readonly reportForm = form(this.reportFormModel, (schemaPath) => {
    required(schemaPath.type, { message: requiredMessage });
    hidden(schemaPath.f24, ({ valueOf }) => valueOf(schemaPath.type) !== ReportTypes.F24);
    hidden(schemaPath.f24.typelessName, ({ valueOf }) => valueOf(schemaPath.f24.type) === null);
    apply(schemaPath.f24, form24Schema({ existingNames: this.form24Names }));
  });

  readonly typeHour = computed(() => {
    const type = this.reportForm.f24.type().value();
    return type ? `${type}-Hour:` : null;
  });
  readonly selectedLabel = computed(() => this.getFormType(this.reportForm.type().value())?.label);
  readonly selectedDescription = computed(() => this.getFormType(this.reportForm.type().value())?.description);

  submitForm() {
    return submit(this.reportForm, {
      action: async () => {
        try {
          const committee = this.committeeStore.committee();
          const { type, f24 } = this.reportForm().value();
          if (type === ReportTypes.F24) {
            const form24 = Form24.fromJSON({
              name: buildF24Name(f24.type!, f24.typelessName),
              report_type_24_48: this.reportForm.f24.type().value(),
              street_1: committee?.street_1,
              street_2: committee?.street_2,
              city: committee?.city,
              state: committee?.state,
              zip: committee?.zip,
              filer_committee_id_number: committee?.committee_id,
              committee_name: committee?.name,
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
