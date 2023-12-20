import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';

import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit {
  showSidebar = false;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectSidebarState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        // Show sidebar if there is an associated "sidebar state" declared in a routing module.
        this.showSidebar = !!state;
      });
  }
}
