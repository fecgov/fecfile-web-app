import { Component, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../store/committee-account.selectors';
import { selectSpinnerStatus } from '../store/spinner.selectors';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SidebarState } from './sidebar/sidebar.component';
import { selectSidebarState, selectSidebarVisible } from 'app/store/sidebar-state.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit {
  committeeAccount$: Observable<CommitteeAccount> | undefined;
  progressBarVisible$: Observable<{ spinnerOn: boolean }> | undefined;
  sidebarState$?: Observable<SidebarState | undefined>;
  showSidebar = true;
  isReports = false;
  private window = window;

  constructor(private router: Router, private route: ActivatedRoute, private store: Store) {
    super();

    this.isReports = this.window.location.href.includes('reports');
    store.select(selectSidebarVisible).subscribe((res) => {
      this.showSidebar = res;
    });
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.isReports = (e as NavigationEnd).url.includes('reports') && !(e as NavigationEnd).url.endsWith('reports');
    });
  }

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
    this.progressBarVisible$ = this.store.select(selectSpinnerStatus);
    this.sidebarState$ = this.store.select(selectSidebarState);
  }

  get isVisible(): boolean {
    return this.showSidebar && this.isReports;
  }
}
