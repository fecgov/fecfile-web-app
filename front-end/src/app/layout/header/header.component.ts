import { Component, DOCUMENT, HostListener, inject, input, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeaderLinksComponent } from './header-links/header-links.component';
import { HeaderStyles } from './header-styles';
import { LayoutService, USE_DYNAMIC_SIDEBAR } from '../layout.service';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgOptimizedImage, HeaderLinksComponent],
})
export class HeaderComponent implements OnInit {
  private readonly document = inject(DOCUMENT);

  readonly layoutService = inject(LayoutService);
  readonly useDynamicSidebar = inject(USE_DYNAMIC_SIDEBAR);
  readonly headerStyle = input(HeaderStyles.DEFAULT);

  isCompact = false;

  private bannerHeight = 30;

  ngOnInit() {
    this.updateBannerHeight();
    this.updateHeaderTotal();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.updateBannerHeight();

    const compact = window.scrollY > this.bannerHeight;

    if (this.isCompact !== compact) {
      this.isCompact = compact;
      this.updateHeaderTotal();
    }
  }

  private updateBannerHeight() {
    const bannerHeightStr = getComputedStyle(this.document.documentElement).getPropertyValue('--header-top') || '30px';

    this.bannerHeight = parseInt(bannerHeightStr, 10);
  }

  private updateHeaderTotal() {
    const headerHeight = this.isCompact ? 54 : 80;

    this.document.documentElement.style.setProperty('--header-total', `calc(${headerHeight}px + var(--header-top))`);
  }

  toggleSidebar() {
    this.layoutService.showSidebar.update((v) => !v);
  }
}
