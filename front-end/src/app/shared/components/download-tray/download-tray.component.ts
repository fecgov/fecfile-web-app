import { Component, computed, inject } from '@angular/core';
import { Download, DotFecService } from 'app/shared/services/dot-fec.service';
import { Drawer } from 'primeng/drawer';
import { PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-download-tray',
  templateUrl: './download-tray.component.html',
  styleUrls: ['./download-tray.component.scss'],
  imports: [Drawer, PrimeTemplate, ButtonModule, Ripple],
})
export class DownloadTrayComponent {
  readonly router = inject(Router);
  readonly dotFecService = inject(DotFecService);

  private readonly routerEvents$ = toSignal(this.router.events.pipe(filter((event) => event instanceof NavigationEnd)));
  readonly sidebarVisible = computed(() => {
    const event = this.routerEvents$();
    return (
      event instanceof NavigationEnd &&
      event.urlAfterRedirects === '/reports' &&
      this.dotFecService.downloads().length > 0
    );
  });

  removeDownload(download: Download) {
    this.dotFecService.downloads.update((downloads) => downloads.filter((d) => d !== download));
  }

  download(download: Download) {
    this.dotFecService.downloadFecFile(download);
  }
}
