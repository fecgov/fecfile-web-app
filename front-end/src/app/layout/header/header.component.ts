import { NgOptimizedImage } from '@angular/common';
import { Component, DOCUMENT, effect, HostListener, inject, input, signal } from '@angular/core';
import { LayoutService } from '../layout.service';
import { DefaultHeaderLinksComponent } from './header-links/default-header-links/default-header-links.component';
import { LoginHeaderLinksComponent } from './header-links/login-header-links/login-header-links.component';
import { LogoutHeaderLinksComponent } from './header-links/logout-header-links/logout-header-links.component';
import { HeaderStyles } from './header-styles';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgOptimizedImage, DefaultHeaderLinksComponent, LoginHeaderLinksComponent, LogoutHeaderLinksComponent],
})
export class HeaderComponent {
  private readonly document = inject(DOCUMENT);
  readonly layoutService = inject(LayoutService);
  readonly headerStyle = input<HeaderStyles>('DEFAULT');
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
