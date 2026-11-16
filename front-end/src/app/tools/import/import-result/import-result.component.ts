import { Component, inject, input, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, exhaustMap, startWith, switchMap, takeWhile, timer, of } from 'rxjs';
import { Router } from '@angular/router';
import { ImportDetail, ImportService, ParsedImportData } from '../import.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface PollState {
  data: ImportDetail | null;
  error: string | null;
}

const isImporting = (status: string | undefined): boolean => {
  return !!(status?.startsWith('import_') && !['import_failed', 'import_completed'].includes(status));
};

@Component({
  selector: 'app-import-result',
  imports: [CardModule, ButtonModule],
  providers: [ImportService],
  templateUrl: './import-result.component.html',
  styleUrl: './import-result.component.scss',
})
export class ImportResultComponent {
  readonly importService = inject(ImportService);

  protected readonly router: Router = inject(Router);
  readonly initialState: PollState = { data: null, error: null };
  readonly importId = input.required<string>();

  readonly state = toSignal(
    toObservable(this.importId).pipe(
      switchMap((id) =>
        timer(0, 2000).pipe(
          exhaustMap(() => this.importService.getImport(id)),
          takeWhile((result) => isImporting(result?.status), true),
          switchMap(
            async (data): Promise<PollState> => ({
              data,
              error: null,
            }),
          ),
          catchError(() =>
            of<PollState>({
              data: null,
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
  readonly importing = computed(() => isImporting(this.importDetail()?.status));
  readonly importIsComplete = computed(() => this.importDetail()?.status === 'import_completed');
  readonly disableSubmission = computed(() => !this.importDetail() || !this.importIsComplete());

  async submitForm() {
    if (this.importIsComplete()) {
      this.router.navigate([`/reports/transactions/report/${this.importDetail()?.report}/list`]);
    }
  }
}
