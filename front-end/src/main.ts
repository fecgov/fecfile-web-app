import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ErrorHandler,
  enableProdMode,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  RouteReuseStrategy,
  Router,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Action, ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import Aura from '@primeuix/themes/aura';
import { USE_DYNAMIC_SIDEBAR } from 'app/layout/layout.service';
import { ROUTES } from 'app/routes';
import { DefaultZeroPipe } from 'app/shared/pipes/default-zero.pipe';
import { DynamicPipe } from 'app/shared/pipes/dynamic.pipe';
import { MemoCodePipe } from 'app/shared/pipes/memo-code.pipe';
import { TransactionIdPipe } from 'app/shared/pipes/transaction-id.pipe';
import { CookieCheckService } from 'app/shared/services/cookie-check.service';
import { FrontendErrorReportingService } from 'app/shared/services/frontend-error-reporting.service';
import { FrontendGlobalErrorHandlerService } from 'app/shared/services/frontend-global-error-handler.service';
import { localStorageSync } from 'ngrx-store-localstorage';
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { providePrimeNG } from 'primeng/config';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PopoverModule } from 'primeng/popover';
import { ToastModule } from 'primeng/toast';
import { SchedulerAction, asyncScheduler } from 'rxjs';
import { AppComponent } from './app/app.component';
import { CustomRouteReuseStrategy } from './app/custom-route-reuse-strategy';
import { HttpErrorInterceptor } from './app/shared/interceptors/http-error.interceptor';
import { FecDatePipe } from './app/shared/pipes/fec-date.pipe';
import { LoginService } from './app/shared/services/login.service';
import { activeReportReducer } from './app/store/active-report.reducer';
import { AppState } from './app/store/app-state.model';
import { committeeAccountReducer } from './app/store/committee-account.reducer';
import { serviceAvailableReducer } from './app/store/service-available.reducer';
import { loginReducer } from './app/store/user-login-data.reducer';
import { environment } from './environments/environment';

function initializeAppFactory(
  loginService: LoginService,
  router: Router,
  cookieCheckService: CookieCheckService,
): () => Promise<void> {
  return async () => {
    if (!cookieCheckService.areCookiesEnabled()) {
      router.navigate(['/cookies-disabled']);
      return;
    }

    function checkSession(this: SchedulerAction<undefined>) {
      if (router.url !== '/login' && !loginService.userIsAuthenticated()) loginService.logOut();
      this.schedule(undefined, 1000);
    }
    asyncScheduler.schedule(checkSession, 1000);
    try {
      if (loginService.userIsAuthenticated()) {
        return await loginService.retrieveUserLoginData();
      }
    } catch (e) {
      console.log(e);
    }
  };
}

const metaReducers: Array<MetaReducer<AppState, Action>> = [localStorageSyncReducer];
function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  try {
    return localStorageSync({
      keys: ['committeeAccount', 'userLoginData', 'activeReport'],
      storageKeySerializer: (key) => `fecfile_online_${key}`,
      rehydrate: true,
    })(reducer);
  } catch (error) {
    console.log(error);
    return reducer;
  }
}

if (environment.production) {
  enableProdMode();
}
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);
const ngCspNonce = document.body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ?? undefined;
bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    CookieCheckService,
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE }),
      StoreModule.forRoot(
        {
          committeeAccount: committeeAccountReducer,
          userLoginData: loginReducer,
          activeReport: activeReportReducer,
          serviceAvailable: serviceAvailableReducer,
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
      PopoverModule,
      ConfirmDialogModule,
      ToastModule,
      CheckboxModule,
    ),
    provideRouter(ROUTES, inMemoryScrollingFeature),
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
    DynamicPipe,
    MemoCodePipe,
    CurrencyPipe,
    TransactionIdPipe,
    DefaultZeroPipe,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    provideAppInitializer(() => {
      const initializerFn = initializeAppFactory(inject(LoginService), inject(Router), inject(CookieCheckService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      inject(FrontendErrorReportingService).initializeGlobalListeners();
    }),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: USE_DYNAMIC_SIDEBAR, useValue: environment.showGlossary },
    { provide: ErrorHandler, useClass: FrontendGlobalErrorHandlerService },
  ],
}).catch((err) => console.log(err));
