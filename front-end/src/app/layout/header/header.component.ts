import { Component, DOCUMENT, ElementRef, HostListener, inject, input, OnDestroy, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);
  readonly layoutService = inject(LayoutService);
  readonly useDynamicSidebar = inject(USE_DYNAMIC_SIDEBAR);
  readonly headerStyle = input(HeaderStyles.DEFAULT);

  isCompact = false;
  private resizeObserver?: ResizeObserver;
  private bannerHeight: number = 30;
  private readonly observedElements = new Set<Element>();

  ngOnInit() {
    const navElement = this.elementRef.nativeElement.querySelector('nav');
    if (navElement) {
      this.resizeObserver = new ResizeObserver(() => {
        this.recalculateLayoutFootprint();
      });

      this.observeLayoutElement(navElement);

      const bannerElement = this.document.querySelector('section.usa-banner');
      if (bannerElement) {
        this.observeLayoutElement(bannerElement);
      }

      this.recalculateLayoutFootprint();
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    this.updateBannerHeight();
    this.isCompact = window.scrollY > this.bannerHeight;
    this.recalculateLayoutFootprint();
  }

  private updateBannerHeight() {
    const bannerHeightStr = getComputedStyle(this.document.documentElement).getPropertyValue('--header-top') || '30px';
    this.bannerHeight = parseInt(bannerHeightStr, 10);
  }

  private observeLayoutElement(element: Element) {
    if (!this.resizeObserver || this.observedElements.has(element)) {
      return;
    }

    this.observedElements.add(element);
    this.resizeObserver.observe(element);
  }

  private recalculateLayoutFootprint() {
    const headerElement = this.elementRef.nativeElement.querySelector('nav');
    const currentHeaderHeight = headerElement ? headerElement.getBoundingClientRect().height : 74;

    const bannerElement = this.document.querySelector('section.usa-banner');
    const bannerHeight = bannerElement ? bannerElement.getBoundingClientRect().height : this.bannerHeight;

    const currentTotalFootprint =
      window.scrollY < bannerHeight ? bannerHeight - window.scrollY + currentHeaderHeight : currentHeaderHeight;

    this.document.documentElement.style.setProperty('--header-total', `${currentTotalFootprint}px`);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  toggleSidebar() {
    this.layoutService.showSidebar.update((v) => !v);
  }
}
