import { Component, DOCUMENT, inject, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly routerEventsSubscription = this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      this.expanded = false;
      this.updateGlobalVariable();
    });

  expanded = false;

  onBannerClick() {
    this.expanded = !this.expanded;
    this.updateGlobalVariable();
  }

  private updateGlobalVariable() {
    const height = this.expanded ? '213px' : '30px';
    this.renderer.setStyle(this.document.documentElement, '--header-top', height, 2);
  }

  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
