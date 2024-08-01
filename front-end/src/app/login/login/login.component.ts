import { Component, OnDestroy, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction } from 'app/store/user-login-data.actions';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginDotGovAuthUrl: string | undefined;
  public localLoginAvailable = false;
  isDropdownOpen = false;
  isDebugOpen = false;
  private renderer: Renderer2;
  listener: () => void;

  constructor(
    private loginService: LoginService,
    private store: Store,
    private cookieService: CookieService,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.listener = this.renderer.listen('document', 'click', (event: Event) => {
      const target = event.target as HTMLElement;
      const dropdownMenuButton = this.renderer.selectRootElement('#dropdownMenuButton', true);

      if (this.isDropdownOpen) {
        this.isDropdownOpen = false;
      } else {
        this.isDropdownOpen = dropdownMenuButton?.contains(target) ?? false;
      }
    });
  }

  ngOnInit() {
    this.cookieService.deleteAll();
    this.store.dispatch(userLoginDataDiscardedAction());
    this.loginDotGovAuthUrl = environment.loginDotGovAuthUrl;
    this.checkLocalLoginAvailability();
  }

  ngOnDestroy() {
    this.listener();
  }

  navigateToLoginDotGov() {
    window.location.href = this.loginDotGovAuthUrl ?? '';
  }

  checkLocalLoginAvailability() {
    this.loginService.checkLocalLoginAvailability().subscribe((available) => {
      this.localLoginAvailable = true;
    });
  }

  showDebugLogin() {
    this.isDebugOpen = true;
  }
}
