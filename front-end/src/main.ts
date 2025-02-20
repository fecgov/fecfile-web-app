import { enableProdMode, provideAppInitializer, inject, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { HttpErrorInterceptor } from './app/shared/interceptors/http-error.interceptor';
import { FecDatePipe } from './app/shared/pipes/fec-date.pipe';
import { RouteReuseStrategy, Router, provideRouter } from '@angular/router';
import { CustomRouteReuseStrategy } from './app/custom-route-reuse-strategy';
import { LoginService } from './app/shared/services/login.service';
import { SchedulerAction, asyncScheduler } from 'rxjs';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { StoreModule, MetaReducer, ActionReducer, Action } from '@ngrx/store';
import { committeeAccountReducer } from './app/store/committee-account.reducer';
import { singleClickReducer } from './app/store/single-click.reducer';
import { loginReducer } from './app/store/user-login-data.reducer';
import { activeReportReducer } from './app/store/active-report.reducer';
import { navigationEventReducer } from './app/store/navigation-event.reducer';
import { AppState } from './app/store/app-state.model';
import { localStorageSync } from 'ngrx-store-localstorage';
import { EffectsModule } from '@ngrx/effects';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { NgOptimizedImage } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PopoverModule } from 'primeng/popover';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from './app/app.component';
import { ROUTES } from 'app/routes';
import { CheckboxModule } from 'primeng/checkbox';
import Aura from '@primeng/themes/aura';

function initializeAppFactory(loginService: LoginService, router: Router): () => Promise<void> {
  return async () => {
    function checkSession(this: SchedulerAction<undefined>) {
      if (router.url !== '/login' && !loginService.userIsAuthenticated()) loginService.logOut();
      this.schedule(undefined, 1000);
    }
    asyncScheduler.schedule(checkSession, 1000);
    try {
      return await loginService.retrieveUserLoginData();
    } catch (e) {
      console.log(e);
    }
  };
}

const metaReducers: Array<MetaReducer<AppState, Action>> = [localStorageSyncReducer];
function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['committeeAccount', 'singleClickDisabled', 'userLoginData', 'activeReport'],
    storageKeySerializer: (key) => `fecfile_online_${key}`,
    rehydrate: true,
  })(reducer);
}

if (environment.production) {
  enableProdMode();
}
const ngCspNonce = document.body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ?? undefined;
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
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
      NgOptimizedImage,
      DialogModule,
      InputTextModule,
      TextareaModule,
      PopoverModule,
      ConfirmDialogModule,
      ToastModule,
      CheckboxModule,
    ),
    provideRouter(ROUTES),
    provideAnimationsAsync(),
    providePrimeNG({
      csp: {
        nonce: ngCspNonce,
      },
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'primeng, theme.css,styles.css',
            darkModeSelector: false,
          },
        },
      },
    }),
    CookieService,
    ConfirmationService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    FecDatePipe,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    provideAppInitializer(() => {
      const initializerFn = initializeAppFactory(inject(LoginService), inject(Router));
      return initializerFn();
    }),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.log(err));
