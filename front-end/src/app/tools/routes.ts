import { Route } from '@angular/router';
import { CashOnHandOverrideComponent } from './cash-on-hand-override/cash-on-hand-override.component';

export const TOOLS_ROUTES: Route[] = [
  {
    path: 'update-cash-on-hand',
    component: CashOnHandOverrideComponent,
    title: 'Update cash on hand',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];
