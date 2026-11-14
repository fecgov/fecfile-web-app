import { Component, computed, inject, input } from '@angular/core';
import { ImportService, ImportDetail } from '../import.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, exhaustMap, map, of, startWith, switchMap, takeWhile, timer } from 'rxjs';

interface PollState {
  data: ImportDetail | null;
  error: string | null;
}

@Component({
  selector: 'app-review-import-plan',
  imports: [],
  providers: [ImportService],
  templateUrl: './review-import-plan.component.html',
  styleUrl: './review-import-plan.component.scss',
})
export class ReviewImportPlanComponent {
  readonly importService = inject(ImportService);

  readonly initialState: PollState = { data: null, error: null };
  readonly importId = input.required<string>();

  readonly state = toSignal(
    toObservable(this.importId).pipe(
      switchMap((id) =>
        timer(0, 2000).pipe(
          exhaustMap(() => this.importService.getImport(id)),
          takeWhile((result) => result.status === 'parsing', true),
          map((data): PollState => ({ data, error: null })),
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
  readonly parsing = computed(() => this.importDetail()?.status === 'parsing');
}
