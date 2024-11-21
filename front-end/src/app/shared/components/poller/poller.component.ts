import { Component, OnDestroy, OnInit } from '@angular/core';
import { PollerService } from 'app/shared/services/poller.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-poller',
  templateUrl: './poller.component.html',
  styleUrl: './poller.component.scss',
})
export class PollerComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  constructor(
    private pollerService: PollerService,
    private location: Location,
  ) {}

  ngOnInit() {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf(this.location.path());

    let deploymentUrl = index === 0 ? currentUrl : currentUrl.substring(0, index);
    deploymentUrl += deploymentUrl.endsWith('/') ? 'index.html' : '/index.html';

    this.pollerService.startPolling(deploymentUrl);
    this.subscription = this.pollerService.isNewVersionAvailable$.subscribe((isNewVersionAvailable) => {
      if (isNewVersionAvailable) {
        this.reload();
      }
    });
  }

  reload() {
    window.location.reload();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  stopPolling() {
    this.pollerService.stopPolling();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
