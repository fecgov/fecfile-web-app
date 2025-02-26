import { Component } from '@angular/core';
import { PollerComponent } from './shared/components/poller/poller.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { DownloadTrayComponent } from './shared/components/download-tray/download-tray.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [PollerComponent, ConfirmDialog, Toast, DownloadTrayComponent, RouterOutlet],
})
export class AppComponent {}
