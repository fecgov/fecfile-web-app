import { Component, OnInit } from '@angular/core';

import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { selectSidebarState } from "../store/sidebar-state.selectors";
import { takeUntil } from "rxjs";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit {
  showSidebar = false;

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
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
