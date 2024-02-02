import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouteData, collectRouteData } from 'app/shared/utils/route.utils';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { filter, takeUntil } from 'rxjs';
import { selectSidebarState } from '../store/sidebar-state.selectors';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit {
  layoutControls = new LayoutControls();

  showSidebar = false; // Legacy control set by a resolver and retrieved from the Store; could be refactored

  constructor(private store: Store, private activatedRoute: ActivatedRoute, private router: Router) {
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

    this.onRouteChange();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.onRouteChange();
    });
  }

  onRouteChange(): void {
    const data = collectRouteData(this.router);

    // Create a new LayoutControls instance so as to reset the controls to their default values
    this.layoutControls = new LayoutControls(data);
  }
}

export class LayoutControls {
  // Default values
  showUpperFooter = true;
  showHeader = true;
  loginHeader = false;
  showCommitteeBanner = true;
  loginBackground = false;
  securityNoticeBackground = false;

  constructor(data?: RouteData) {
    if (data) {
      // If a key is present in the data, use its value; otherwise, use the default
      this.showUpperFooter = data['showUpperFooter'] ?? this.showUpperFooter;
      this.showCommitteeBanner = data['showCommitteeBanner'] ?? this.showCommitteeBanner;
      this.showHeader = data['showHeader'] ?? this.showHeader;
      this.loginHeader = data['loginHeader'] ?? this.loginHeader;

      this.loginBackground = data['loginBackground'] ?? this.loginBackground;
      this.securityNoticeBackground = data['securityNoticeBackground'] ?? this.securityNoticeBackground;
    }
  }
}
