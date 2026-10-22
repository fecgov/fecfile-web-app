import { Component, computed, ElementRef, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { CommitteeStore } from './committee/committee.store';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { DownloadTrayComponent } from './shared/components/download-tray/download-tray.component';
import { PollerComponent } from './shared/components/poller/poller.component';
import { SecondCommitteeAdminDialogComponent } from './shared/components/second-committee-admin-dialog/second-committee-admin-dialog.component';
import { LoginService } from './shared/services/login.service';

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
    ConfirmDialogComponent,
    DialogComponent,
  ],
})
export class AppComponent {
  readonly committeeStore = inject(CommitteeStore);
  readonly loginService = inject(LoginService);
  readonly router = inject(Router);
  protected readonly elementRef = inject(ElementRef);
  readonly memberService = inject(CommitteeMemberService);

  readonly showCommitteeChangedDialog = computed(() => {
    const url = this.router.url;
    const isLoginRoute = url === '/login' || url.startsWith('/login/');
    return !isLoginRoute && this.committeeStore.committeeChangedInOtherTab();
  });
}
