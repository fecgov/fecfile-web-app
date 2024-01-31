import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { DebugLoginComponent } from './debug-login/debug-login.component';
import { SecurityNoticeComponent } from './security-notice/security-notice.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent, DebugLoginComponent, SecurityNoticeComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, NgOptimizedImage, LoginRoutingModule],
})
export class LoginModule {}
