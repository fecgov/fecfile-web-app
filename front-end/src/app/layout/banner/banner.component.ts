import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnDestroy {
  expanded = false;
  @ViewChild('banner') bannerElement!: ElementRef;
  private routerEventsSubscription!: Subscription;

  constructor(private router: Router) {
    this.routerEventsSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.expanded = false;
      });
  }

  getBannerElement(): HTMLElement {
    return this.bannerElement.nativeElement;
  }

  onBannerClick() {
    this.expanded = !this.expanded;
  }

  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
