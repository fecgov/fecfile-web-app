import { Component, OnDestroy, OnInit } from '@angular/core';
import { PollerService } from 'app/shared/services/poller.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-poller',
  templateUrl: './poller.component.html',
  styleUrl: './poller.component.scss',
})
export class PollerComponent implements OnInit, OnDestroy {
  isNewVersionAvailable = false;
  private subscription!: Subscription;

  constructor(
    private pollerService: PollerService,
    private location: Location,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf(this.location.path());

    let deploymentUrl = index === 0 ? currentUrl : currentUrl.substring(0, index);
    deploymentUrl += deploymentUrl.endsWith('/') ? 'index.html' : '/index.html';

    this.pollerService.startPolling(deploymentUrl);
    this.subscription = this.pollerService.isNewVersionAvailable$.subscribe((isNex) => {
      this.isNewVersionAvailable = isNex;
      if (this.isNewVersionAvailable) {
        this.confirmationService.confirm({
          key: 'refresh',
          message:
            'A new version of the application has been deployed! Would you like to refresh the page to receive the new app?',
          header: 'App Update',
          accept: () => this.reload(),
          reject: () => this.stopPolling(),
        });
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
