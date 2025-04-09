import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { injectNavigationEnd } from 'ngxtension/navigation-end';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  private readonly bannerElement = viewChild.required<ElementRef>('banner');
  readonly expanded = signal(false);

  constructor() {
    injectNavigationEnd().subscribe(() => this.expanded.set(false));
  }

  getBannerElement(): HTMLElement {
    return this.bannerElement().nativeElement;
  }

  onBannerClick() {
    this.expanded.update((val) => !val);
  }
}
