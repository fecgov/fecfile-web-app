import { Component, DOCUMENT, effect, HostListener, inject, input, signal } from '@angular/core';
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
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);
  readonly layoutService = inject(LayoutService);
  readonly useDynamicSidebar = inject(USE_DYNAMIC_SIDEBAR);

  readonly headerStyle = input(HeaderStyles.DEFAULT);
  readonly isCompact = signal(false);

  constructor() {
    effect(() => {
      const headerHeight = this.isCompact() ? 54 : 80;
      this.document.documentElement.style.setProperty('--header-total', `calc(${headerHeight}px + var(--header-top))`);
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isCompact.set(window.scrollY > 0);
  }

  toggleSidebar() {
    this.layoutService.showSidebar.update((v) => !v);
  }
}
