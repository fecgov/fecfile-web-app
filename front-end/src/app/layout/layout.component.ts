/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, AfterViewChecked, inject, viewChild, computed, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { collectRouteData, RouteData } from 'app/shared/utils/route.utils';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommitteeBannerComponent } from './committee-banner/committee-banner.component';
import { ButtonDirective } from 'primeng/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { HeaderStyles } from './header/header-styles';
import { LayoutService, USE_DYNAMIC_SIDEBAR } from './layout.service';

export enum BackgroundStyles {
  'DEFAULT' = '',
  'LOGIN' = 'login-background',
  'SECURITY_NOTICE' = 'security-notice-background',
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    BannerComponent,
    HeaderComponent,
    SidebarComponent,
    CommitteeBannerComponent,
    RouterOutlet,
    FooterComponent,
    ButtonDirective,
    FeedbackOverlayComponent,
  ],
})
export class LayoutComponent implements AfterViewChecked {
  readonly layoutService = inject(LayoutService);
  readonly useDynamicSidebar = inject(USE_DYNAMIC_SIDEBAR);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  readonly feedbackOverlay = viewChild.required(FeedbackOverlayComponent);
  private readonly navEnd = toSignal(injectNavigationEnd());

  readonly isDefault = computed(() => this.layoutControls().backgroundStyle === BackgroundStyles.DEFAULT);

  readonly layoutControls = computed(() => {
    this.navEnd();
    return new LayoutControls(collectRouteData(this.route.snapshot));
  });

  isCookiesDisabled = signal(false);

  readonly topPadding = computed(() => {
    if (this.layoutControls().backgroundStyle === BackgroundStyles.LOGIN) {
      return '0px';
    } else if (this.isCookiesDisabled()) {
      return '165px';
    } else {
      return '64px';
    }
  });

  constructor() {
    if (this.useDynamicSidebar) {
      const mobileQuery = window.matchMedia('(max-width: 991.98px)');
      if (mobileQuery.matches) {
        this.layoutService.showSidebar.set(false);
      }

      const listener = (e: MediaQueryListEvent) => {
        const showing = this.layoutService.showSidebar();
        if (showing && e.matches) {
          this.layoutService.showSidebar.set(false);
        } else if (!showing && !e.matches) {
          this.layoutService.showSidebar.set(true);
        }
      };

      mobileQuery.addEventListener('change', listener);
      this.destroyRef.onDestroy(() => mobileQuery.removeEventListener('change', listener));
    }
  }

  ngAfterViewChecked(): void {
    this.isCookiesDisabled.set((this.route.root as any)._routerState.snapshot.url === '/cookies-disabled');
  }

  toggleSidebar() {
    this.layoutService.showSidebar.update((v) => !v);
  }
}

class LayoutControls {
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
