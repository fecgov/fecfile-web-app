import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, min, pattern, required, validate } from '@angular/forms/signals';
import { Store } from '@ngrx/store';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { CalendarComponent } from 'app/shared/components/calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { VersionData } from './version-data';
import { ReportService } from 'app/shared/services/report.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-update-version-number',
  imports: [ButtonModule, FormsModule, CalendarComponent, FormField, FormRoot],
  templateUrl: './update-version-number.component.html',
  styleUrl: './update-version-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateVersionNumberComponent {
  private readonly reportService = inject(ReportService);
  private readonly store = inject(Store);
  protected readonly messageService = inject(MessageService);
  protected readonly report = this.store.selectSignal(selectActiveReport);
  protected readonly isF24 = computed(() => this.report().report_type === ReportTypes.F24);

  private readonly versionModel = signal<VersionData>({
    original: '',
    amendment: '',
    eFilingId: '',
    previousSubmissionDate: null,
  });
  protected readonly versionForm = form(
    this.versionModel,
    (schema) => {
      disabled(schema.original);
      required(schema.amendment, { message: 'This is a required field' });
      min(schema.amendment, 1, { message: 'Invalid number' });
      pattern(schema.amendment, /^\d+$/, { message: 'Invalid number' });
      required(schema.eFilingId, { message: 'This is a required field' });
      required(schema.previousSubmissionDate, {
        when: () => this.isF24(),
        message: 'This is a required field',
      });
      validate(schema.previousSubmissionDate, ({ value }) => {
        const rawValue = value();
        if (!rawValue) return null;
        if (typeof rawValue === 'string') {
          const parsedTimestamp = Date.parse(rawValue);
          if (Number.isNaN(parsedTimestamp) || /[a-zA-Z]/.test(rawValue)) {
            return { kind: 'pattern' };
          }
        }

        if (rawValue instanceof Date && Number.isNaN(rawValue.getTime())) {
          return { kind: 'pattern' };
        }

        return null;
      });
      disabled(schema.previousSubmissionDate, () => !this.isF24());
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: async (field) => {
          this.formSubmitted = true;
          try {
            await this.reportService.updateVersionNumber(this.report(), this.versionForm().value());
            this.reportService.setActiveReportById(this.report().id);
            this.versionForm().reset({
              original: this.report().report_version ?? 0,
              amendment: '',
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
          this.formSubmitted = true;
          const firstError = field().errorSummary()[0];
          firstError?.fieldTree().focusBoundControl();
        },
      },
    },
  );
  protected formSubmitted = false;

  constructor() {
    effect(() => {
      const report = this.report();
      this.versionForm.original().value.set(report.report_version ?? 0);
    });
  }

  protected blockInvalidKeys(event: KeyboardEvent): void {
    const invalidKeys = ['-', '.', '+', 'e', 'E'];
    if (invalidKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
