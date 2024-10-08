// Anguluar
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, Router } from '@angular/router';

// NGRX
import { EffectsModule } from '@ngrx/effects';
import { Action, ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { activeReportReducer } from './store/active-report.reducer';
import { AppState } from './store/app-state.model';
import { committeeAccountReducer } from './store/committee-account.reducer';
import { singleClickReducer } from './store/single-click.reducer';
import { loginReducer } from './store/user-login-data.reducer';
import { navigationEventReducer } from './store/navigation-event.reducer';

// PrimeNG
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';

// Third party
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

// App
import { NgOptimizedImage } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BannerComponent } from './layout/banner/banner.component';
import { CommitteeBannerComponent } from './layout/committee-banner/committee-banner.component';
import { FeedbackOverlayComponent } from './layout/feedback-overlay/feedback-overlay.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderLinksComponent } from './layout/header/header-links/header-links.component';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { F1MMenuComponent } from './layout/sidebar/menus/f1m/f1m-menu.component';
import { F24MenuComponent } from './layout/sidebar/menus/f24/f24-menu.component';
import { F3XMenuComponent } from './layout/sidebar/menus/f3x/f3x-menu.component';
import { F99MenuComponent } from './layout/sidebar/menus/f99/f99-menu.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { FecDatePipe } from './shared/pipes/fec-date.pipe';
import { LoginService } from './shared/services/login.service';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { SchedulerAction, asyncScheduler } from 'rxjs';
import { ReportsModule } from './reports/reports.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

// Save ngrx store to localStorage dynamically
function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['committeeAccount', 'singleClickDisabled', 'userLoginData', 'activeReport'],
    storageKeySerializer: (key) => `fecfile_online_${key}`,
    rehydrate: true,
  })(reducer);
}

function initializeAppFactory(loginService: LoginService, router: Router): () => Promise<void> {
  return () => {
    function checkSession(this: SchedulerAction<undefined>) {
      if (router.url !== '/login' && !loginService.userIsAuthenticated()) loginService.logOut();
      this.schedule(undefined, 1000);
    }
    asyncScheduler.schedule(checkSession, 1000);
    return loginService.retrieveUserLoginData().catch((e) => e);
  };
}

const metaReducers: Array<MetaReducer<AppState, Action>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    CommitteeBannerComponent,
    HeaderLinksComponent,
    HeaderComponent,
    BannerComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    F3XMenuComponent,
    F1MMenuComponent,
    F99MenuComponent,
    F24MenuComponent,
    FeedbackOverlayComponent,
  ],
  imports: [
    BrowserModule,
    UsersModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE }),
    StoreModule.forRoot(
      {
        committeeAccount: committeeAccountReducer,
        singleClickDisabled: singleClickReducer,
        userLoginData: loginReducer,
        activeReport: activeReportReducer,
        navigationEvent: navigationEventReducer,
      },
      { metaReducers },
    ),
    EffectsModule.forRoot([]),
    MenubarModule,
    PanelMenuModule,
    PanelModule,
    ButtonModule,
    SharedModule,
    NgOptimizedImage,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    OverlayPanelModule,
    SharedModule,
    ReportsModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [
    CookieService,
    ConfirmationService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    FecDatePipe,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [LoginService, Router],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
