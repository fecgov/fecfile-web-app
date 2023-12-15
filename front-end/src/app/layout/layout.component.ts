import { Component, OnInit } from '@angular/core';
import { takeUntil, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { selectSpinnerStatus } from '../store/spinner.selectors';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit {
  progressBarVisible$: Observable<{ spinnerOn: boolean }> | undefined;
  showSidebar = false;

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.progressBarVisible$ = this.store.select(selectSpinnerStatus);

    this.store
      .select(selectSidebarState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        // Show sidebar if there is an associated "sidebar state" declared in a routing module.
        this.showSidebar = state.section !== undefined;
      });
  }
}
