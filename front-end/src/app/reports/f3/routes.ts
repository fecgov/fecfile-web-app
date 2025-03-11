import { Route } from '@angular/router';
import { CreateF3Step1Component } from './create-workflow/create-f3-step1/create-f3-step1.component';
import { ReportIsEditableGuard } from 'app/shared/guards/report-is-editable.guard';

export const F3X_ROUTES: Route[] = [
  {
    path: 'create/step1',
    title: 'Create a report',
    component: CreateF3Step1Component,
    runGuardsAndResolvers: 'always',
    data: {
      showSidebar: false,
    },
  },
  {
    path: 'create/step1/:reportId',
    title: 'Create a report',
    component: CreateF3Step1Component,
    canActivate: [ReportIsEditableGuard],
    runGuardsAndResolvers: 'always',
  },
];
