import { AfterViewInit, Component, OnInit } from '@angular/core';

import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Store } from '@ngrx/store';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ActivationStart,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { selectSidebarState } from '../store/sidebar-state.selectors';
import { filter, switchMap, takeUntil } from 'rxjs';
import { collectRouteData } from 'app/shared/utils/route.utils';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit, AfterViewInit {
  showSidebar = false;

  showUpperFooter = true;
  showHeader = true;
  loginHeader = false;

  loginBackground = false;
  securityNoticeBackground = false;

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

    this.router.events.subscribe((data) => {
      if (data instanceof ActivationStart) {
        const routeData = data.snapshot.data;
        if (routeData) {
          //console.log(routeData);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    const data = collectRouteData(this.router);
    this.showUpperFooter = data['showUpperFooter'] ?? this.showUpperFooter;
    this.showHeader = data['showHeader'] ?? this.showHeader;
    this.loginHeader = data['loginHeader'] ?? this.loginHeader;

    this.loginBackground = data['loginBackground'] ?? this.loginBackground;
    this.securityNoticeBackground = data['securityNoticeBackground'] ?? this.securityNoticeBackground;
  }
}
