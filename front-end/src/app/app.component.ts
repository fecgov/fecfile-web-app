import { AfterContentChecked, Component, ElementRef, inject, viewChild } from '@angular/core';
import { PollerComponent } from './shared/components/poller/poller.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { DownloadTrayComponent } from './shared/components/download-tray/download-tray.component';
import { RouterOutlet } from '@angular/router';
import { SecondCommitteeAdminDialogComponent } from './shared/components/second-committee-admin-dialog/second-committee-admin-dialog.component';
import { ButtonModule } from 'primeng/button';

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
  ],
})
export class AppComponent implements AfterContentChecked {
  protected readonly elementRef = inject(ElementRef);
  readonly confirmDialog = viewChild.required(ConfirmDialog);

  ngAfterContentChecked(): void {
    const visible = this.confirmDialog().visible;
    if (!visible) return;
    const closeButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-dialog-close-button');
    if (!closeButton) return;
    if (closeButton.ariaLabel) return;
    closeButton.ariaLabel = 'Close';
  }
}
