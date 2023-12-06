// Anguluar
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

// NGRX
import { EffectsModule } from '@ngrx/effects';
import { Action, ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { activeReportReducer } from './store/active-report.reducer';
import { AppState } from './store/app-state.model';
import { cashOnHandReducer } from './store/cash-on-hand.reducer';
import { CommitteeAccountEffects } from './store/committee-account.effects';
import { committeeAccountReducer } from './store/committee-account.reducer';
import { LoginEffects } from './store/login.effects';
import { loginReducer } from './store/login.reducer';
import { sidebarStateReducer, sidebarVisibleReducer } from './store/sidebar-state.reducer';
import { spinnerReducer } from './store/spinner.reducer';

// PrimeNG
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';

// Third party
import { CookieService } from 'ngx-cookie-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BannerComponent } from './layout/banner/banner.component';
import { CommitteeBannerComponent } from './layout/committee-banner/committee-banner.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { F3XMenuComponent } from './layout/sidebar/menus/f3x/f3x-menu.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './login/login/login.component';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { FecDatePipe } from './shared/pipes/fec-date.pipe';
import { SharedModule } from './shared/shared.module';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { NgOptimizedImage } from '@angular/common';
import { HeaderLinksComponent } from './layout/header/header-links/header-links.component';
import { F1MMenuComponent } from './layout/sidebar/menus/f1m/f1m-menu.component';

// Save ngrx store to localStorage dynamically
function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['committeeAccount', 'spinnerOn', 'userLoginData', 'activeReport', 'cashOnHand', 'sidebarState'],
    storageKeySerializer: (key) => `fecfile_online_${key}`,
    rehydrate: true,
  })(reducer);
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
    LoginComponent,
    DashboardComponent,
    F3XMenuComponent,
    F1MMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE }),
    StoreModule.forRoot(
      {
        committeeAccount: committeeAccountReducer,
        spinnerOn: spinnerReducer,
        userLoginData: loginReducer,
        activeReport: activeReportReducer,
        cashOnHand: cashOnHandReducer,
        sidebarState: sidebarStateReducer,
        sidebarVisible: sidebarVisibleReducer,
      },
      { metaReducers }
    ),
    EffectsModule.forRoot([CommitteeAccountEffects, LoginEffects]),
    MenubarModule,
    PanelMenuModule,
    PanelModule,
    ButtonModule,
    ProgressBarModule,
    SharedModule,
    NgOptimizedImage,
  ],
  providers: [
    CookieService,
    ConfirmationService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    FecDatePipe,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
