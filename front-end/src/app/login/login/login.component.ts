import { AfterViewChecked, Component, effect, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction } from 'app/store/user-login-data.actions';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { ButtonModule } from 'primeng/button';
import { ApiService } from 'app/shared/services/api.service';
import { HttpResponse } from '@angular/common/http';
import { setServiceAvailableAction } from 'app/store/service-available.actions';
import { DialogModule } from 'primeng/dialog';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { selectServiceAvailable } from 'app/store/service-available.selectors';
import { takeUntil } from 'rxjs';
import { DestroyerComponent } from 'app/shared/components/destroyer.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ButtonModule, DialogModule, DialogComponent],
})
export class LoginComponent extends DestroyerComponent implements OnInit, AfterViewChecked {
  private readonly store = inject(Store);
  private readonly cookieService = inject(CookieService);
  protected readonly apiService = inject(ApiService);
  public loginDotGovAuthUrl: string | undefined;
  readonly disableLogin: boolean = environment.disableLogin;
  readonly serviceAvailable = this.store.selectSignal(selectServiceAvailable);

  protected loginDialogVisible = signal(false);
  readonly whoCanUseLink = environment.whoCanUseLink;

  constructor() {
    super();

    effect(() => {
      const available = this.serviceAvailable();
      if (available === false) {
        this.loginDialogVisible.set(true);
      }
    });
  }

  ngOnInit() {
    this.cookieService.deleteAll();
    this.store.dispatch(userLoginDataDiscardedAction());
    this.loginDotGovAuthUrl = environment.loginDotGovAuthUrl;

    window.addEventListener('resize', this.updateScrollbarWidth);
  }

  ngAfterViewChecked() {
    this.updateScrollbarWidth();
  }

  async navigateToLoginDotGov() {
    const available = this.serviceAvailable();
    if (available === false) {
      this.store.dispatch(setServiceAvailableAction({ payload: undefined }));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: HttpResponse<any> = await this.apiService.get_from_base_uri('/devops/status/');
    if (response.status) {
      this.store.dispatch(setServiceAvailableAction({ payload: true }));
      globalThis.location.href = this.loginDotGovAuthUrl ?? '';
    }
  }

  updateScrollbarWidth() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  }

  dialogClose() {
    this.loginDialogVisible.update(() => false);
  }
}
