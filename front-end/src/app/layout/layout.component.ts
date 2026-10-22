import { Component, computed, DestroyRef, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { LoginService } from 'app/shared/services/login.service';
import { collectRouteData, RouteData } from 'app/shared/utils/route.utils';
import { selectServiceAvailable } from 'app/store/service-available.selectors';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
import { BannerComponent } from './banner/banner.component';
import { CommitteeBannerComponent } from './committee-banner/committee-banner.component';
import { EnvironmentBannerComponent } from './environment-banner/environment-banner.component';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderStyles } from './header/header-styles';
import { HeaderComponent } from './header/header.component';
import { LayoutService } from './layout.service';
import { ServiceUnavailableBannerComponent } from './service-unavailable-banner/service-unavailable-banner.component';
import { ReportSidebarComponent } from './sidebar/report-sidebar/report-sidebar.component';
import { SecurityNoticeSidebarComponent } from './sidebar/security-notice-sidebar/security-notice-sidebar.component';

export enum BackgroundStyles {
  'DEFAULT' = '',
  'LOGIN' = 'login-background',
  'SECURITY_NOTICE' = 'security-notice-background',
}

export const Sidebar = {
  Report: 'Report',
  Security: 'Security',
} as const;
export type Sidebar = (typeof Sidebar)[keyof typeof Sidebar];

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    EnvironmentBannerComponent,
    BannerComponent,
    HeaderComponent,
    ReportSidebarComponent,
    SecurityNoticeSidebarComponent,
    CommitteeBannerComponent,
    RouterOutlet,
    FooterComponent,
    FeedbackOverlayComponent,
    ServiceUnavailableBannerComponent,
    DialogComponent,
  ],
})
export class LayoutComponent {
  Sidebar = Sidebar;
  private readonly router = inject(Router);
  readonly layoutService = inject(LayoutService);
  readonly loginService = inject(LoginService);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  private readonly navEnd = toSignal(injectNavigationEnd());
  readonly serviceAvailable = this.store.selectSignal(selectServiceAvailable);

  readonly isDefault = computed(() => this.layoutControls().backgroundStyle === BackgroundStyles.DEFAULT);
  readonly layoutControls = computed(() => {
    this.navEnd();
    return new LayoutControls(collectRouteData(this.route.snapshot));
  });

  readonly isCookiesDisabled = computed(() => {
    this.navEnd();
    return this.router.url === '/cookies-disabled';
  });

  readonly environmentBanner = viewChild<ElementRef>('environmentBanner');
  readonly environmentBannerVisible = signal(true);

  constructor() {
    effect((onCleanup) => {
      const banner = this.environmentBanner()?.nativeElement;

      if (!banner) {
        this.environmentBannerVisible.set(false);
        return;
      }

      const observer = new IntersectionObserver(([entry]) => this.environmentBannerVisible.set(entry.isIntersecting), {
        threshold: 0,
      });

      observer.observe(banner);

      onCleanup(() => observer.disconnect());
    });
  }
}

class LayoutControls {
  // Default values
  showUpperFooter = true;
  showHeader = true;
  sidebar: Sidebar | null = null;
  useServiceUnavailableLoginBanner = false;
  headerStyle: HeaderStyles = 'DEFAULT';
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
      this.sidebar = data['sidebar'] ?? this.sidebar;
      this.headerStyle = data['headerStyle'] ?? this.headerStyle;
      this.backgroundStyle = (data['backgroundStyle'] as BackgroundStyles) ?? this.backgroundStyle;
      this.useServiceUnavailableLoginBanner =
        data['showServiceUnavailableBanner'] ?? this.useServiceUnavailableLoginBanner;
    }
  }
}
