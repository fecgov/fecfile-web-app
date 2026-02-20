import { Route } from '@angular/router';
import { ReportSidebarSection } from 'app/layout/sidebar/menu-info';

export const REPORTS_ROUTES: Route[] = [
  {
    path: '',
    title: 'Manage Reports',
    loadComponent: () => import('./report-list/report-list.component').then((m) => m.ReportListComponent),
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
    loadChildren: () => import('./f3/routes').then((module) => module.F3_ROUTES),
  },
  {
    path: 'f3x',
    loadChildren: () => import('./f3x/routes').then((module) => module.F3X_ROUTES),
  },
  {
    path: 'f99',
    loadChildren: () => import('./f99/routes').then((module) => module.F99_ROUTES),
  },
  {
    path: 'f24',
    loadChildren: () => import('./f24/routes').then((module) => module.F24_ROUTES),
  },
  {
    path: 'f1m',
    loadChildren: () => import('./f1m/routes').then((module) => module.F1M_ROUTES),
  },
  { path: '**', redirectTo: '' },
];