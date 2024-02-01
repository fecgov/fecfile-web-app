import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecurityNoticeComponent } from './security-notice/security-notice.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from 'app/shared/guards/login-page.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    data: {
      showUpperFooter: false,
      showCommitteeBanner: false,
      loginHeader: true,
      loginBackground: true,
    },
    canActivate: [LoginGuard],
  },
  {
    path: 'security-notice',
    title: 'Security Notice',
    component: SecurityNoticeComponent,
    pathMatch: 'full',
    data: {
      showHeader: false,
      securityNoticeBackground: true,
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
