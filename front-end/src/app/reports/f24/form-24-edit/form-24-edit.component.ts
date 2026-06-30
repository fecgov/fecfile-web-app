import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { debounce, form, FormField, required, submit, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Form24, Type24_48 } from 'app/shared/models';
import { Form24Service } from 'app/shared/services/form-24.service';
import { MessageService } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { InputGroup } from 'primeng/inputgroup';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { derivedAsync } from 'ngxtension/derived-async';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';

interface Form24Data {
  type: Type24_48 | null;
  typelessName: string;
}

@Component({
  selector: 'app-f24-edit',
  templateUrl: './form-24-edit.component.html',
  styleUrls: ['./form-24-edit.component.scss', '../../styles.scss'],
  imports: [ButtonModule, FormField, AutoFocusModule, SelectButtonModule, InputGroup, SaveCancelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form24EditComponent {
  protected readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly form24Service = inject(Form24Service);
  private readonly store = inject(Store);

  private readonly activeReport = this.store.selectSignal(selectActiveReport);
  private readonly report = computed(() => this.activeReport() as Form24);
  private readonly form24Names = derivedAsync(
    async () => {
      const reports = await this.form24Service.getAllReports();
      return new Set<string>(reports.map((r) => r.name!));
    },
    { initialValue: new Set<string>() },
  );

  private readonly f24Model = signal<Form24Data>({
    type: null,
    typelessName: '',
  });

  readonly form24Options = [
    { label: '24-Hour ', value: '24' },
    { label: '48-Hour', value: '48' },
  ];

  readonly f24Form = form(this.f24Model, (schema) => {
    required(schema.type, { message: 'This is a required field' });
    required(schema.typelessName, { message: 'This is a required field' });
    debounce(schema.typelessName, 300);
    validate(schema.typelessName, () => {
      const name = this.fullName();
      if (name === this.report().name || !this.form24Names().has(name)) return null;
      return {
        kind: 'exists',
        message: 'This name is already in use. Please choose a different name.',
      };
    });
  });

  readonly typeHour = computed(() => `${this.f24Form.type().value()}-Hour:`);
  private readonly fullName = computed(() => `${this.typeHour()} ${this.f24Form.typelessName().value()}`);

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
          const payload = Form24.fromJSON({
            ...this.report()!,
            name: this.fullName(),
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
