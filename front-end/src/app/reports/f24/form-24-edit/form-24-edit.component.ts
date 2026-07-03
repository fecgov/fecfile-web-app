import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { apply, form, FormField, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Form24Service } from 'app/shared/services/form-24.service';
import { MessageService } from 'primeng/api';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { derivedAsync } from 'ngxtension/derived-async';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { SelectButtonInput } from 'app/shared/components/signal-inputs/select-button-input/select-button.input';
import { form24Options } from 'app/shared/utils/label.utils';
import { buildF24Name, Form24, form24Schema, Type24_48 } from 'app/shared/models/reports/form-24.model';
import { InputGroupInput } from 'app/shared/components/signal-inputs/input-group/input-group.input';

interface Form24Data {
  type: Type24_48 | null;
  typelessName: string;
}

@Component({
  selector: 'app-f24-edit',
  templateUrl: './form-24-edit.component.html',
  styleUrls: [],
  imports: [FormField, SaveCancelComponent, SelectButtonInput, InputGroupInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form24EditComponent {
  readonly form24Options = form24Options;
  protected readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly form24Service = inject(Form24Service);
  private readonly store = inject(Store);

  private readonly activeReport = this.store.selectSignal(selectActiveReport);
  private readonly report = computed(() => this.activeReport() as Form24);
  readonly typeHour = computed(() => {
    const type = this.f24Form.type().value();
    return type ? `${type}-Hour:` : null;
  });
  private readonly form24Names = derivedAsync(
    async () => {
      const reports = await this.form24Service.getAllReports();
      return new Set<string>(reports.filter((r) => r.id !== this.report().id).map((r) => r.name!));
    },
    { initialValue: new Set<string>() },
  );

  private readonly f24Model = signal<Form24Data>({ type: null, typelessName: '' });
  readonly f24Form = form(this.f24Model, (schemaPath) => {
    apply(
      schemaPath,
      form24Schema({
        existingNames: this.form24Names,
      }),
    );
  });

  constructor() {
    effectOnceIf(
      () => this.report(),
      (report) => {
        const regex = /^(24-Hour:\s|48-Hour:\s)(.*)$/;
        const match = report.name?.match(regex);
        if (match) {
          this.f24Form().reset({
            type: match[1].includes('24') ? '24' : '48',
            typelessName: match[2],
          });
        }
      },
    );
  }

  submitForm(action: 'continue' | void) {
    return submit(this.f24Form, {
      ignoreValidators: 'none',
      action: async () => {
        try {
          const { type, typelessName } = this.f24Form().value();
          const payload = Form24.fromJSON({
            ...this.report()!,
            name: buildF24Name(type!, typelessName),
          });
          await this.form24Service.update(payload, ['name']);

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Report name updated',
            life: 3000,
          });
          if (action === 'continue') {
            this.router.navigate(['/reports/transactions/report/', this.report().id, 'list']);
          } else {
            this.router.navigateByUrl('/reports');
          }
          return;
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update form 24 name',
            life: 3000,
          });
          return { kind: 'serverError', message: 'Failed to submit form:' };
        }
      },
      onInvalid: (field) => {
        const firstError = field().errorSummary()[0];
        firstError?.fieldTree().focusBoundControl();
      },
    });
  }
}
