import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
// import { TooltipModule } from 'primeng/tooltip';

import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login/login.component';
import { TwoFactorLoginComponent } from './login/two-factor-login/two-factor-login.component';
import { ConfirmTwoFactorComponent } from './login/confirm-two-factor/confirm-two-factor.component';
import { SharedModule } from './shared/shared.module';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    TwoFactorLoginComponent,
    ConfirmTwoFactorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    MenubarModule,
    MenuModule,
    SidebarModule,

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
    NgbActiveModal,
    DecimalPipe,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
