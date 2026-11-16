import { Component, computed, inject, input } from '@angular/core';
import { ImportService, ImportDetail, ParsedImportData } from '../import.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, exhaustMap, map, of, startWith, switchMap, takeWhile, timer } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { CardModule } from 'primeng/card';

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
  imports: [CardModule, JsonPipe],
  providers: [ImportService],
  templateUrl: './review-import-plan.component.html',
  styleUrl: './review-import-plan.component.scss',
})
export class ReviewImportPlanComponent {
  readonly importService = inject(ImportService);

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
  readonly parsedData = computed(() => this.state().parsedData);
}
