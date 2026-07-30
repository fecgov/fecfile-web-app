import { Component, effect, ElementRef, inject } from '@angular/core';
import { PollerComponent } from './shared/components/poller/poller.component';
import { Toast } from 'primeng/toast';
import { DownloadTrayComponent } from './shared/components/download-tray/download-tray.component';
import { Router, RouterOutlet } from '@angular/router';
import { SecondCommitteeAdminDialogComponent } from './shared/components/second-committee-admin-dialog/second-committee-admin-dialog.component';
import { ButtonModule } from 'primeng/button';
import { GlossaryComponent } from './shared/components/glossary/glossary.component';
import { environment } from 'environments/environment';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { CommitteeStore } from './committee/committee.store';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    PollerComponent,
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
  private readonly committeeStore = inject(CommitteeStore);
  protected readonly elementRef = inject(ElementRef);
  readonly memberService = inject(CommitteeMemberService);
  readonly confirmationService = inject(ConfirmationService);
  readonly showGlossary = environment.showGlossary;
  readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (this.committeeStore.committeeChangedInOtherTab()) {
        this.confirmationService.confirm({
          message: 'You must refresh',
          header: 'Committee has changed',
          accept: () => this.router.navigateByUrl('/'),
        });
      }
    });
  }
}
