import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { collectRouteData, RouteData } from 'app/shared/utils/route.utils';
import { filter, takeUntil } from 'rxjs';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { HeaderStyles, HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommitteeBannerComponent } from './committee-banner/committee-banner.component';
import { ButtonDirective } from 'primeng/button';

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
export class LayoutComponent extends DestroyerComponent implements OnInit, AfterViewChecked {
  @ViewChild(FeedbackOverlayComponent) feedbackOverlay!: FeedbackOverlayComponent;
  readonly router: Router = inject(Router);
  layoutControls = new LayoutControls();
  readonly BackgroundStyles = BackgroundStyles;

  @ViewChild('footerRef') footer!: FooterComponent;
  @ViewChild('contentOffset') contentOffset!: ElementRef;
  @ViewChild('bannerRef') banner!: BannerComponent;

  ngAfterViewChecked(): void {
    this.updateContentOffset();
  }

  updateContentOffset() {
    if (this.layoutControls.showSidebar) return;
    if (!this.contentOffset) return;
    const height = this.contentOffset.nativeElement.offsetHeight;
    const footerHeight = this.footer ? this.footer.getFooterElement().offsetHeight : 0;
    const bannerHeight = this.banner ? this.banner.getBannerElement().offsetHeight : 0;
    const currentPadding =
      this.contentOffset.nativeElement.style.paddingBottom === ''
        ? 0
        : parseInt(this.contentOffset.nativeElement.style.paddingBottom, 10);

    const paddingBottom = Math.max(64, window.innerHeight - height - footerHeight - bannerHeight + currentPadding);

    // Apply the margin-bottom to the div
    this.contentOffset.nativeElement.style.paddingBottom = paddingBottom + 'px';
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
