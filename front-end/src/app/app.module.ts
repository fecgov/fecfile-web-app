import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppLayoutComponent } from './app-layout/app-layout.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'angular-archwizard';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CookieService } from 'ngx-cookie-service';
import { NgxEditorModule } from 'ngx-editor';
import { NgPipesModule } from 'ngx-pipes';
import { ConfirmModalComponent } from './shared/partials/confirm-modal/confirm-modal.component';
import { OrderByPipe } from './shared/pipes/order-by/order-by.pipe';
import { PhonePipe } from './shared/pipes/phone-number/phone-number.pipe';
import { SafeHTMLPipe } from './shared/pipes/safeHTML/safe-html.pipe';
import { ZipCodePipe } from './shared/pipes/zip-code/zip-code.pipe';
import { DialogService } from './shared/services/DialogService/dialog.service';
import { SharedModule } from './shared/shared.module';
import { CanActivateGuard } from './shared/utils/can-activate/can-activate.guard';
import { UtilService } from './shared/utils/util.service';
import { LoginComponent } from './app-main-login/login/login.component';
import { TwoFactorLoginComponent } from './app-main-login/two-factor-login/two-factor-login.component';
import { ConfirmTwoFactorComponent } from './app-main-login/confirm-two-factor/confirm-two-factor.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    ConfirmModalComponent,
    ZipCodePipe,
    SafeHTMLPipe,
    OrderByPipe,
    LoginComponent,
    TwoFactorLoginComponent,
    ConfirmTwoFactorComponent,
  ],
  entryComponents: [ConfirmModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE }),
    SharedModule,
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    ArchwizardModule,
    NgxEditorModule,
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    AngularEditorModule,
    NgPipesModule,
  ],
  providers: [
    CookieService,
    CanActivateGuard,
    DialogService,
    NgbActiveModal,
    DecimalPipe,
    DatePipe,
    UtilService,
    OrderByPipe,
    PhonePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
