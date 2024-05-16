import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  expanded = false;

  onBannerClick() {
    this.expanded = !this.expanded;
  }
}
