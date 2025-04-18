import { Component, computed, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { PollerService } from 'app/shared/services/poller.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-poller',
  templateUrl: './poller.component.html',
  styleUrl: './poller.component.scss',
})
export class PollerComponent implements OnInit, OnDestroy {
  private readonly pollerService = inject(PollerService);
  private readonly location = inject(Location);

  readonly deploymentUrl = computed(() => {
    const currentUrl = window.location.href;
    const index = currentUrl.indexOf(this.location.path());
    const baseUrl = index === 0 ? currentUrl : currentUrl.substring(0, index);
    return baseUrl.endsWith('/') ? baseUrl + 'index.html' : baseUrl + '/index.html';
  });

  constructor() {
    effect(() => {
      if (this.pollerService.isNewVersionAvailable()) {
        this.reload();
      }
    });
  }

  ngOnInit() {
    this.pollerService.startPolling(this.deploymentUrl());
  }

  reload() {
    window.location.reload();
  }

  ngOnDestroy() {
    this.pollerService.stopPolling();
  }
}
