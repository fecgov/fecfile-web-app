import { Component, OnInit, ViewChild } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { collectRouteData, RouteData } from 'app/shared/utils/route.utils';
import { filter, takeUntil } from 'rxjs';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { HeaderStyles } from './header/header.component';

export enum BackgroundStyles {
  'DEFAULT' = '',
  'LOGIN' = 'login-background',
  'SECURITY_NOTICE' = 'security-notice-background',
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent implements OnInit {
  @ViewChild(FeedbackOverlayComponent) feedbackOverlay!: FeedbackOverlayComponent;

  layoutControls = new LayoutControls();

  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.onRouteChange();
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(() => {
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
  showSidebar = false;
  headerStyle = HeaderStyles.DEFAULT;
  showCommitteeBanner = true;
  showFeedbackButton = true;
  backgroundStyle = BackgroundStyles.DEFAULT;

  constructor(data?: RouteData) {
    if (data) {
      // If a key is present in the data, use its value; otherwise, use the default
      this.showUpperFooter = data['showUpperFooter'] ?? this.showUpperFooter;
      this.showCommitteeBanner = data['showCommitteeBanner'] ?? this.showCommitteeBanner;
      this.showFeedbackButton = data['showFeedbackButton'] ?? this.showFeedbackButton;
      this.showHeader = data['showHeader'] ?? this.showHeader;
      this.showSidebar = data['showSidebar'] ?? this.showSidebar;
      this.headerStyle = (data['headerStyle'] as HeaderStyles) ?? this.headerStyle;
      this.backgroundStyle = (data['backgroundStyle'] as BackgroundStyles) ?? this.backgroundStyle;
    }
  }
}
