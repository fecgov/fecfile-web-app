import { Component, ElementRef, inject, viewChild, signal, effect, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { collectRouteData, RouteData } from 'app/shared/utils/route.utils';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { HeaderStyles, HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommitteeBannerComponent } from './committee-banner/committee-banner.component';
import { ButtonDirective } from 'primeng/button';
import { injectNavigationEnd } from 'ngxtension/navigation-end';
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
export class LayoutComponent extends DestroyerComponent implements AfterViewChecked {
  private readonly route = inject(ActivatedRoute);
  readonly feedbackOverlay = viewChild.required<FeedbackOverlayComponent>(FeedbackOverlayComponent);
  readonly footer = viewChild<FooterComponent>('footerRef');
  readonly contentOffset = viewChild<ElementRef>('contentOffset');
  readonly banner = viewChild.required<BannerComponent>('bannerRef');

  readonly layoutControls = signal(new LayoutControls());

  readonly BackgroundStyles = BackgroundStyles;

  constructor() {
    super();

    const source$ = injectNavigationEnd();
    source$.subscribe(() => this.layoutControls.set(new LayoutControls(collectRouteData(this.route.snapshot))));

    effect(() => {
      this.updateContentOffset();
    });
  }
  ngAfterViewChecked(): void {
    this.updateContentOffset();
  }

  updateContentOffset() {
    if (this.layoutControls().showSidebar) return;
    const offset = this.contentOffset();
    if (!offset) return;
    const height = offset.nativeElement.offsetHeight;
    const footerHeight = this.footer() ? this.footer()!.footerElement().nativeElement.offsetHeight : 0;
    const bannerHeight = this.banner ? this.banner().getBannerElement().offsetHeight : 0;
    const currentPadding =
      this.contentOffset()?.nativeElement.style.paddingBottom === ''
        ? 0
        : parseInt(this.contentOffset()?.nativeElement.style.paddingBottom, 10);

    const paddingBottom = Math.max(64, window.innerHeight - height - footerHeight - bannerHeight + currentPadding);

    // Apply the margin-bottom to the div
    offset.nativeElement.style.paddingBottom = paddingBottom + 'px';
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
