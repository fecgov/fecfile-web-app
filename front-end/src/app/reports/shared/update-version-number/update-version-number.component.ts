import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, min, required, validate } from '@angular/forms/signals';
import { Store } from '@ngrx/store';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { VersionData } from './version-data';
import { ReportService } from 'app/shared/services/report.service';
import { MessageService } from 'primeng/api';
import { integer, NumberInput } from 'app/shared/components/signal-inputs/number-input/number.input';
import { DateInput } from 'app/shared/components/signal-inputs/date-input/date.input';
import { TextInput } from 'app/shared/components/signal-inputs/text-input/text.input';
import { SignalFormComponent } from 'app/shared/components/signal-form/signal-form.component';
import { validateDate } from 'app/shared/components/signal-inputs/date-input/date.validators';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';

const invalidNumber = 'Invalid number';

@Component({
  selector: 'app-update-version-number',
  imports: [ButtonModule, FormsModule, FormField, FormRoot, NumberInput, DateInput, TextInput],
  templateUrl: './update-version-number.component.html',
  styleUrl: './update-version-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateVersionNumberComponent extends SignalFormComponent<VersionData> {
  private readonly reportService = inject(ReportService);
  private readonly store = inject(Store);
  protected readonly messageService = inject(MessageService);
  protected readonly report = this.store.selectSignal(selectActiveReport);
  readonly isF24 = computed(() => this.report().report_type === ReportTypes.F24);

  protected readonly model = signal<VersionData>({
    original: 0,
    amendment: 0,
    eFilingId: '',
    previousSubmissionDate: null,
  });
  readonly form = form(
    this.model,
    (schema) => {
      disabled(schema.original);
      required(schema.amendment, { message: requiredMessage });
      min(schema.amendment, 0, { message: invalidNumber });
      integer(schema.amendment, { message: invalidNumber });
      validate(schema.amendment, ({ value, valueOf }) => {
        if (valueOf(schema.original) === value()) {
          return { kind: 'mismatch', message: invalidNumber };
        }
        return null;
      });
      disabled(schema.eFilingId, ({ valueOf }) => valueOf(schema.amendment) === 0);
      required(schema.eFilingId, {
        when: ({ valueOf }) => valueOf(schema.amendment) !== 0,
        message: requiredMessage,
      });
      disabled(schema.previousSubmissionDate, ({ valueOf }) => valueOf(schema.amendment) === 0);
      required(schema.previousSubmissionDate, {
        when: ({ valueOf }) => this.isF24() && valueOf(schema.amendment) !== 0,
        message: requiredMessage,
      });
      validateDate(schema.previousSubmissionDate);
      disabled(schema.previousSubmissionDate, () => !this.isF24());
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: async () => {
          try {
            await this.reportService.updateVersionNumber(this.report(), this.form().value());
            const report = await this.reportService.setActiveReportById(this.report().id);
            this.form().reset({
              original: Number.parseInt(report.report_version) ?? 0,
              amendment: 0,
              eFilingId: '',
              previousSubmissionDate: null,
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Amendment version updated',
              life: 3000,
            });
            return;
          } catch {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update amendment version ',
              life: 30000,
            });
            return { kind: 'serverError', message: 'Failed to submit form:' };
          }
        },
        onInvalid: (field) => {
          const firstError = field().errorSummary()[0];
          firstError?.fieldTree().focusBoundControl();
        },
      },
    },
  );

  constructor() {
    super();
    effect(() => {
      const report = this.report();
      this.form.original().value.set(Number.parseInt(report.report_version ?? '0') ?? 0);
    });
  }

  protected blockInvalidKeys(event: KeyboardEvent): void {
    const invalidKeys = ['-', '.', '+', 'e', 'E'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
