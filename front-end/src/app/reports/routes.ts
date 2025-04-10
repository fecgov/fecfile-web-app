import { Route } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { Form3Service } from 'app/shared/services/form-3.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Form99Service } from 'app/shared/services/form-99.service';
import { ReportService } from 'app/shared/services/report.service';
import { Form24Service } from 'app/shared/services/form-24.service';
import { Form1MService } from 'app/shared/services/form-1m.service';

export const REPORTS_ROUTES: Route[] = [
  {
    path: '',
    title: 'Manage Reports',
    component: ReportListComponent,
    pathMatch: 'full',
    data: {
      showSidebar: false,
    },
  },
  {
    path: 'transactions',
    data: { sidebarSection: ReportSidebarSection.TRANSACTIONS },
    loadChildren: () => import('./transactions/routes').then((module) => module.TRANSACTION_ROUTES),
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'f3',
    providers: [{ provide: ReportService, useClass: Form3Service }],
    loadChildren: () => import('./f3/routes').then((module) => module.F3_ROUTES),
  },
  {
    path: 'f3x',
    providers: [{ provide: ReportService, useClass: Form3XService }],
    loadChildren: () => import('./f3x/routes').then((module) => module.F3X_ROUTES),
  },
  {
    path: 'f99',
    providers: [{ provide: ReportService, useClass: Form99Service }],
    loadChildren: () => import('./f99/routes').then((module) => module.F99_ROUTES),
  },
  {
    path: 'f24',
    providers: [{ provide: ReportService, useClass: Form24Service }],
    loadChildren: () => import('./f24/routes').then((module) => module.F24_ROUTES),
  },
  {
    path: 'f1m',
    providers: [{ provide: ReportService, useClass: Form1MService }],
    loadChildren: () => import('./f1m/routes').then((module) => module.F1M_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
