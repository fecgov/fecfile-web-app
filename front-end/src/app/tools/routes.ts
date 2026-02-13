import { Route } from '@angular/router';

export const TOOLS_ROUTES: Route[] = [
  {
    path: 'update-cash-on-hand',
    loadComponent: () =>
      import('./cash-on-hand-override/cash-on-hand-override.component').then((m) => m.CashOnHandOverrideComponent),
    title: 'Update cash on hand',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
