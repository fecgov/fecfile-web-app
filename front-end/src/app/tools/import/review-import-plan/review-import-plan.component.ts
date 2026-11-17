import { Component, computed, inject, input } from '@angular/core';
import { ImportService, ImportDetail, ParsedImportData } from '../import.service';
import { PreviewReportDetailsComponent } from '../preview-report-details/preview-report-details.component';
import { PreviewHeaderDetailsComponent } from '../preview-header-details/preview-header-details.component';
import { PreviewTransactionDetailsComponent } from '../preview-transaction-details/preview-transaction-details.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, exhaustMap, map, of, startWith, switchMap, takeWhile, timer } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

interface PollState {
  data: ImportDetail | null;
  parsedData: ParsedImportData | null;
  error: string | null;
}

const isParsing = (status: string | undefined): boolean => {
  return !!(status?.startsWith('parse_') && status !== 'parse_completed');
};

@Component({
  selector: 'app-review-import-plan',
  imports: [
    CardModule,
    JsonPipe,
    ButtonModule,
    PreviewReportDetailsComponent,
    PreviewHeaderDetailsComponent,
    PreviewTransactionDetailsComponent,
  ],
  providers: [ImportService],
  templateUrl: './review-import-plan.component.html',
  styleUrl: './review-import-plan.component.scss',
})
export class ReviewImportPlanComponent {
  readonly importService = inject(ImportService);

  protected readonly router: Router = inject(Router);
  readonly initialState: PollState = { data: null, parsedData: null, error: null };
  readonly importId = input.required<string>();

  readonly state = toSignal(
    toObservable(this.importId).pipe(
      switchMap((id) =>
        timer(0, 2000).pipe(
          exhaustMap(() => this.importService.getImport(id)),
          takeWhile((result) => isParsing(result?.status), true),
          switchMap(
            async (data): Promise<PollState> => ({
              data,
              parsedData: data.status === 'parse_completed' && id ? await this.importService.getParsedData(id) : null,
              error: null,
            }),
          ),
          catchError(() =>
            of<PollState>({
              data: null,
              parsedData: null,
              error: 'Unable to check import status. Please try again.',
            }),
          ),
          startWith(this.initialState),
        ),
      ),
    ),
    { initialValue: this.initialState },
  );

  readonly importDetail = computed(() => this.state().data);
  readonly error = computed(() => this.state().error);
  readonly parsing = computed(() => isParsing(this.importDetail()?.status));
  readonly parsingIsComplete = computed(() => this.importDetail()?.status === 'parse_completed');
  readonly parsedData = computed(() => this.state().parsedData);
  readonly disableSubmission = computed(() => !this.parsedData() || !this.parsingIsComplete());

  async submitForm() {
    if (!this.parsedData() || !this.parsingIsComplete()) {
      return;
    }
    await this.importService.startImport(this.importId());
    this.router.navigate([`/tools/import/${this.importId()}/result`]);
  }
}
