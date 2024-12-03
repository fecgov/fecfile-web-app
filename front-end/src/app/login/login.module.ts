import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { SecurityNoticeComponent } from './security-notice/security-notice.component';

@NgModule({
  declarations: [LoginComponent, SecurityNoticeComponent],
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
    DialogModule,
  ],
  exports: [SecurityNoticeComponent],
})
export class LoginModule {}
