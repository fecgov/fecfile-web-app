import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { refreshCommitteeAccountDetailsAction } from '../../../store/committee-account.actions';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

@Component({
  selector: 'app-create-f3x-step3',
  templateUrl: './create-f3x-step3.component.html',
})
export class CreateF3xStep3Component implements OnInit, OnDestroy {
  report: F3xSummary | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();
  committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private f3xSummaryService: F3xSummaryService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Refresh committee account details whenever page loads
    this.store.dispatch(refreshCommitteeAccountDetailsAction());

    this.report = this.activatedRoute.snapshot.data['report'];
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
