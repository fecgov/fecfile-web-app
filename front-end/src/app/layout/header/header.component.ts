import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeaderLinksComponent } from './header-links/header-links.component';

export enum HeaderStyles {
  'DEFAULT',
  'LOGIN',
  'LOGOUT',
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgOptimizedImage, HeaderLinksComponent],
})
export class HeaderComponent {
  @Input() headerStyle = HeaderStyles.DEFAULT;
}
