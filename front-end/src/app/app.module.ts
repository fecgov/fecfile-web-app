// Anguluar
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// NGRX
import { StoreModule, ActionReducer, MetaReducer, Action } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { localStorageSync } from 'ngrx-store-localstorage';
import { loginReducer } from './store/login.reducer';
import { committeeAccountReducer } from './store/committee-account.reducer';
import { spinnerReducer } from './store/spinner.reducer';
import { CommitteeAccountEffects } from './store/committee-account.effects';
import { LoginEffects } from './store/login.effects';
import { AppState } from './store/app-state.model';
import { activeReportReducer } from './store/active-report.reducer';
import { cashOnHandReducer } from './store/cash-on-hand.reducer';
import { sidebarStateReducer } from './store/sidebar-state.reducer';

// PrimeNG
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

// Third party
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { CookieService } from 'ngx-cookie-service';

// App
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoginComponent } from './login/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { FecDatePipe } from './shared/pipes/fec-date.pipe';
import { MenuReportComponent } from './layout/sidebar/menu-report/menu-report.component';
import { BannerComponent } from './layout/banner/banner.component';

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
    HeaderComponent,
    BannerComponent,
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent,
    MenuReportComponent,
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
  ],
  providers: [
    CookieService,
    ConfirmationService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    FecDatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
