import { Component, ElementRef, inject } from '@angular/core';
import { PollerComponent } from './shared/components/poller/poller.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { DownloadTrayComponent } from './shared/components/download-tray/download-tray.component';
import { RouterOutlet } from '@angular/router';
import { SecondCommitteeAdminDialogComponent } from './shared/components/second-committee-admin-dialog/second-committee-admin-dialog.component';
import { ButtonModule } from 'primeng/button';
import { GlossaryComponent } from './shared/components/glossary/glossary.component';
import { environment } from 'environments/environment';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    PollerComponent,
    ConfirmDialog,
    Toast,
    DownloadTrayComponent,
    RouterOutlet,
    SecondCommitteeAdminDialogComponent,
    ButtonModule,
    GlossaryComponent,
    ConfirmDialogComponent,
  ],
})
export class AppComponent {
  protected readonly elementRef = inject(ElementRef);
  readonly showGlossary = environment.showGlossary;
}
