import { Component, computed, ElementRef, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PollerComponent } from './shared/components/poller/poller.component';
import { Toast } from 'primeng/toast';
import { DownloadTrayComponent } from './shared/components/download-tray/download-tray.component';
import { SecondCommitteeAdminDialogComponent } from './shared/components/second-committee-admin-dialog/second-committee-admin-dialog.component';
import { ButtonModule } from 'primeng/button';
import { GlossaryComponent } from './shared/components/glossary/glossary.component';
import { environment } from 'environments/environment';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { CommitteeMemberService } from 'app/shared/services/committee-member.service';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { CommitteeStore } from './committee/committee.store';
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
    GlossaryComponent,
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
  readonly showGlossary = environment.showGlossary;

  readonly showCommitteeChangedDialog = computed(() => {
    const url = this.router.url;
    const isLoginRoute = url === '/login' || url.startsWith('/login/');

    return !isLoginRoute && this.committeeStore.committeeChangedInOtherTab();
  });
}
