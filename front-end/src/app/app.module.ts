import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'angular-archwizard';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CookieService } from 'ngx-cookie-service';
import { NgxEditorModule } from 'ngx-editor';
import { NgPipesModule } from 'ngx-pipes';
import { AccountComponent } from './account/account.component';
import { AdminModule } from './admin/admin.module';
import { AppConfigService } from './app-config.service';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AppMainLoginModule } from './app-main-login/app-main-login.module';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportheaderComponent } from './reports/reportheader/reportheader.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportsFilterTypeComponent } from './reports/reportsidebar/filter-type/reports-filter-type.component';
import { ReportsidebarComponent } from './reports/reportsidebar/reportsidebar.component';
import { ExportDirective } from './shared/directives/export.directive';
import { ConfirmModalComponent } from './shared/partials/confirm-modal/confirm-modal.component';
import { FilterPipe } from './shared/pipes/filter/filter.pipe';
import { OrderByPipe } from './shared/pipes/order-by/order-by.pipe';
import { PhonePipe } from './shared/pipes/phone-number/phone-number.pipe';
import { SafeHTMLPipe } from './shared/pipes/safeHTML/safe-html.pipe';
import { ZipCodePipe } from './shared/pipes/zip-code/zip-code.pipe';
import { DialogService } from './shared/services/DialogService/dialog.service';
import { TokenInterceptorService } from './shared/services/TokenInterceptorService/token-interceptor-service.service';
import { SharedModule } from './shared/shared.module';
import { CanActivateGuard } from './shared/utils/can-activate/can-activate.guard';
import { UtilService } from './shared/utils/util.service';
import { ApiService } from './shared/services/APIService/api.service';

const appInitializerFn = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AppLayoutComponent,
    ReportsComponent,
    AccountComponent,
    ConfirmModalComponent,
    ZipCodePipe,
    FilterPipe,
    ReportsidebarComponent,
    ReportheaderComponent,
    SafeHTMLPipe,
    OrderByPipe,
    ReportsFilterTypeComponent,
    ExportDirective,
  ],
  entryComponents: [ConfirmModalComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE }),
    SharedModule,
    AdminModule,
    AppMainLoginModule,
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    routing,
    ArchwizardModule,
    NgxEditorModule,
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    AngularEditorModule,
    NgPipesModule,
    // UserIdleModule.forRoot({ idle: 780, timeout: 120, ping: 500000 }), NG-UPGRADE-ISSUE
  ],
  providers: [
    CookieService,
    CanActivateGuard,
    DialogService,
    AppConfigService,
    NgbActiveModal,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService],
    },
    DecimalPipe,
    DatePipe,
    UtilService,
    OrderByPipe,
    PhonePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiService, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
