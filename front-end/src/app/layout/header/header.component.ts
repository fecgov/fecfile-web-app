import { Component, Input } from '@angular/core';
import { LoginService } from 'app/shared/services/login.service';
import { Store } from '@ngrx/store';
import { toggleSidebarVisibleAction } from '../../store/sidebar-state.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  loginService: LoginService;
  private window = window;
  @Input() loginPage = false;

  constructor(loginService: LoginService, private store: Store) {
    this.loginService = loginService;
  }

  toggleSideBar() {
    if (this.window.location.href.includes('reports')) this.store.dispatch(toggleSidebarVisibleAction());
  }
}
