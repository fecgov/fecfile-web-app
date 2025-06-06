import { Route } from '@angular/router';
import { LayoutComponent } from '../../layout/layout.component';

export const ROUTES_CR: Route[] = [
  {
    path: '',
    component: LayoutComponent,
  },
  { path: '**', redirectTo: '' },
];
