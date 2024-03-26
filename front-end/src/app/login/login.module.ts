import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { DebugLoginComponent } from './debug-login/debug-login.component';
import { SecurityNoticeComponent } from './security-notice/security-notice.component';
import { LoginComponent } from './login/login.component';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { LoginRoutingModule } from './login-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@NgModule({
  declarations: [LoginComponent, DebugLoginComponent, SecurityNoticeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LoginRoutingModule,
    NgOptimizedImage,
    DividerModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
  ],
})
export class LoginModule {}
