import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  expanded = false;
  @ViewChild('banner') bannerElement!: ElementRef;

  getBannerElement(): HTMLElement {
    return this.bannerElement.nativeElement;
  }

  onBannerClick() {
    this.expanded = !this.expanded;
  }
}
