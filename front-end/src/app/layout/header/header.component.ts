import { Component, Input } from '@angular/core';
import { LoginService } from 'app/shared/services/login.service';
import { Store } from '@ngrx/store';
import { toggleSidebarVisibleAction } from '../../store/sidebar-state.actions';

export enum HeaderStyles {
  'DEFAULT',
  'LOGIN',
  'LOGOUT',
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  loginService: LoginService;
  @Input() headerStyle = HeaderStyles.DEFAULT;
  private window = window;

  constructor(
    loginService: LoginService,
    private store: Store,
  ) {
    this.loginService = loginService;
  }

  toggleSideBar() {
    if (this.window.location.href.includes('reports')) this.store.dispatch(toggleSidebarVisibleAction());
  }
}
