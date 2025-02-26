import { Component, inject, OnInit } from '@angular/core';
import { Download, DotFecService } from 'app/shared/services/dot-fec.service';
import { Drawer } from 'primeng/drawer';
import { PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-download-tray',
  templateUrl: './download-tray.component.html',
  styleUrls: ['./download-tray.component.scss'],
  imports: [Drawer, PrimeTemplate, ButtonModule, Ripple],
})
export class DownloadTrayComponent implements OnInit {
  private readonly dotFecService = inject(DotFecService);
  sidebarVisible = false;
  downloads: Download[] = [];

  ngOnInit(): void {
    this.dotFecService.downloads.subscribe((downloads) => {
      this.downloads = downloads;
      this.sidebarVisible = this.downloads.length > 0;
    });
  }

  removeDownload(download: Download) {
    const downloads = this.downloads.filter((d) => d !== download);
    this.dotFecService.downloads.next(downloads);
  }

  download(download: Download) {
    this.dotFecService.downloadFecFile(download);
  }
}
