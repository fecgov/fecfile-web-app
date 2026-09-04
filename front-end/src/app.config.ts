import { CurrencyPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideRouter,
  RouteReuseStrategy,
  Router,
  InMemoryScrollingFeature,
  withInMemoryScrolling,
  InMemoryScrollingOptions,
} from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Action, ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { CustomRouteReuseStrategy } from 'app/custom-route-reuse-strategy';
import { USE_DYNAMIC_SIDEBAR } from 'app/layout/layout.service';
import { HttpErrorInterceptor } from 'app/shared/interceptors/http-error.interceptor';
import { DefaultZeroPipe } from 'app/shared/pipes/default-zero.pipe';
import { DynamicPipe } from 'app/shared/pipes/dynamic.pipe';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { MemoCodePipe } from 'app/shared/pipes/memo-code.pipe';
import { TransactionIdPipe } from 'app/shared/pipes/transaction-id.pipe';
import { CookieCheckService } from 'app/shared/services/cookie-check.service';
import { FrontendErrorReportingService } from 'app/shared/services/frontend-error-reporting.service';
import { FrontendGlobalErrorHandlerService } from 'app/shared/services/frontend-global-error-handler.service';
import { LoginService } from 'app/shared/services/login.service';
import { activeReportReducer } from 'app/store/active-report.reducer';
import { AppState } from 'app/store/app-state.model';
import { committeeAccountReducer } from 'app/store/committee-account.reducer';
import { navigationEventReducer } from 'app/store/navigation-event.reducer';
import { serviceAvailableReducer } from 'app/store/service-available.reducer';
import { singleClickReducer } from 'app/store/single-click.reducer';
import { loginReducer } from 'app/store/user-login-data.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { ROUTES } from 'app/routes';
import Aura from '@primeuix/themes/aura';
import { FEATURE_FLAGS } from 'environments/tokens/feature-flags.config';
import { asyncScheduler, SchedulerAction } from 'rxjs';
import { API_CONFIG } from 'environments/tokens/api.config';
import { ERROR_REPORTING_CONFIG } from 'environments/tokens/error-reporting.config';

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

const ngCspNonce = document.body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ?? undefined;
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);
const metaReducers: Array<MetaReducer<AppState, Action>> = [localStorageSyncReducer];
function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  try {
    return localStorageSync({
      keys: ['committeeAccount', 'singleClickDisabled', 'userLoginData', 'activeReport'],
      storageKeySerializer: (key) => `fecfile_online_${key}`,
      rehydrate: true,
    })(reducer);
  } catch (error) {
    console.log(error);
    return reducer;
  }
}

export const appConfig: ApplicationConfig = {
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
          singleClickDisabled: singleClickReducer,
          userLoginData: loginReducer,
          activeReport: activeReportReducer,
          navigationEvent: navigationEventReducer,
          serviceAvailable: serviceAvailableReducer,
        },
        { metaReducers },
      ),
      EffectsModule.forRoot([]),
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
    { provide: ERROR_REPORTING_CONFIG, useValue: environment.errorReporting },
    {
      provide: FEATURE_FLAGS,
      useValue: {
        showGlossary: environment.showGlossary,
        showForm3: environment.showForm3,
        showSchedF: environment.showSchedF,
        enableUnassignedTransactions: environment.enableUnassignedTransactions,
        enableImport: environment.enableImport,
        manualReportVersion: environment.manualReportVersion,
        userCanSetFilingFrequency: environment.userCanSetFilingFrequency,
      },
    },
    {
      provide: API_CONFIG,
      useValue: {
        name: environment.name,
        baseUri: environment.baseUri,
        apiUrl: environment.apiUrl,
        loginDotGovAuthUrl: environment.loginDotGovAuthUrl,
        loginDotGovLogoutUrl: environment.loginDotGovLogoutUrl,
        ffapiTimeoutCookieName: environment.ffapiTimeoutCookieName,
        form1Link: environment.form1Link,
        whoCanUseLink: environment.whoCanUseLink,
        webForms: environment.webForms,
        disableLogin: environment.disableLogin,
        environmentBanner: environment.environmentBanner,
      },
    },
  ],
};
