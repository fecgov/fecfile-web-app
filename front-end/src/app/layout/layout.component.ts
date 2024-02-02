import { Component, OnInit } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { Store } from "@ngrx/store";
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { filter, takeUntil } from "rxjs";
import { selectSidebarState } from "../store/sidebar-state.selectors";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit {
  showSidebar = false;
  showCommitteeBanner = true;
  hideCommitteeBannerUrlList = [
    '/committee/users/current'
  ];

  constructor(private store: Store, private router: Router) {
    super();
    this.router.events.pipe(takeUntil(this.destroy$),
      filter((event): event is NavigationEnd =>
        event instanceof NavigationEnd)).subscribe(navEndEvent => {
          this.showCommitteeBanner =
            !this.hideCommitteeBannerUrlList.includes(navEndEvent.url);
        });
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
