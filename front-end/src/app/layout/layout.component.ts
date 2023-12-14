import { Component, OnInit } from '@angular/core';
import { takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
// import { selectCommitteeAccount } from '../store/committee-account.selectors';
import { selectSpinnerStatus } from '../store/spinner.selectors';
// import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { ActivatedRoute, Router } from '@angular/router';
// import { SidebarState } from './sidebar/sidebar.component';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit {
  // committeeAccount$: Observable<CommitteeAccount> | undefined;
  progressBarVisible$: Observable<{ spinnerOn: boolean }> | undefined;
  // sidebarState$?: Observable<SidebarState | undefined>;
  showSidebar = false;
  // isReports = false;
  // private window = window;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private store: Store) {
    super();

    // this.isReports =
    //   this.window.location.href.includes('reports') &&
    //   this.window.location.href.endsWith('reports') &&
    //   this.window.location.href.endsWith('f3x/create/step1');
    // store.select(selectSidebarVisible).subscribe((res) => {
    //   this.showSidebar = res;
    // });
    // router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
    //   this.isReports =
    //     (e as NavigationEnd).url.includes('reports') &&
    //     !(e as NavigationEnd).url.endsWith('reports') &&
    //     !(e as NavigationEnd).url.endsWith('f3x/create/step1');
    // });
  }

  ngOnInit(): void {
    this.progressBarVisible$ = this.store.select(selectSpinnerStatus);

    this.store
      .select(selectSidebarState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        // Show sidebar if there is an associated "sidebar state" declared in a routing module.
        debugger;
        this.showSidebar = !!state;
      });
  }

  // get isVisible(): boolean {
  //   return this.showSidebar && this.isReports;
  // }
}
