import { Component, OnInit } from '@angular/core';
import { Download, DotFecService } from 'app/shared/services/dot-fec.service';

@Component({
  selector: 'app-download-tray',
  templateUrl: './download-tray.component.html',
  styleUrls: ['./download-tray.component.scss'],
})
export class DownloadTrayComponent implements OnInit {
  sidebarVisible = false;
  downloads: Download[] = [];

  constructor(private dotFecService: DotFecService) {}

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
