import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../store/committee-account.selectors';
import { selectSpinnerStatus } from '../store/spinner.selectors';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarState } from './sidebar/sidebar.component';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  committeeAccount$: Observable<CommitteeAccount> | undefined;
  progressBarVisible$: Observable<{ spinnerOn: boolean }> | undefined;
  sidebarState$?: Observable<SidebarState | undefined>;
  private destroy$ = new Subject<boolean>();

  constructor(private router: Router, private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
    this.progressBarVisible$ = this.store.select(selectSpinnerStatus);
    this.sidebarState$ = this.store.select(selectSidebarState);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
