import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeaderLinksComponent } from './header-links/header-links.component';
import { HeaderStyles } from './header-styles';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgOptimizedImage, HeaderLinksComponent],
})
export class HeaderComponent {
  readonly headerStyle = input(HeaderStyles.DEFAULT);
}
