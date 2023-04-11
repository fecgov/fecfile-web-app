import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../store/committee-account.selectors';
import { selectSpinnerStatus } from '../store/spinner.selectors';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Router, Event, ActivationStart } from '@angular/router';
import { Sidebars } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  committeeAccount$: Observable<CommitteeAccount> | undefined;
  progressBarVisible$: Observable<{ spinnerOn: boolean }> | undefined;
  sidebar: Sidebars | undefined = undefined;
  sidebars = Sidebars;
  private destroy$ = new Subject<boolean>();

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
    this.progressBarVisible$ = this.store.select(selectSpinnerStatus);

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
      if (event instanceof ActivationStart) {
        const data = event.snapshot.data;
        this.sidebar = data?.['sidebar']?.['sidebar'];
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
