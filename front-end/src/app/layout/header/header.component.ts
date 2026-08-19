import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeaderStyles } from './header-styles';
import { LayoutService, USE_DYNAMIC_SIDEBAR } from '../layout.service';
import { DefaultHeaderLinksComponent } from './header-links/default-header-links/default-header-links.component';
import { LoginHeaderLinksComponent } from './header-links/login-header-links/login-header-links.component';
import { LogoutHeaderLinksComponent } from './header-links/logout-header-links/logout-header-links.component';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgOptimizedImage, DefaultHeaderLinksComponent, LoginHeaderLinksComponent, LogoutHeaderLinksComponent],
})
export class HeaderComponent {
  readonly layoutService = inject(LayoutService);
  readonly useDynamicSidebar = inject(USE_DYNAMIC_SIDEBAR);
  readonly headerStyle = input<HeaderStyles>('DEFAULT');

  toggleSidebar() {
    this.layoutService.showSidebar.update((v) => !v);
  }
}
