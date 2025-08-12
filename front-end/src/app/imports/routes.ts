import { Route } from '@angular/router';
import { ImportListComponent } from './import-list/import-list.component';
import { ImportDetailComponent } from './import-detail/import-detail.component';
import { ImportResolver } from 'app/shared/resolvers/import.resolver';

export const IMPORT_ROUTES: Route[] = [
  {
    path: ':importId',
    title: 'Review Imported dotFEC',
    component: ImportDetailComponent,
    resolve: { import_obj: ImportResolver },
  },
  {
    path: '',
    title: 'Manage dotFEC File Imports',
    component: ImportListComponent,
    pathMatch: 'full',
    data: {
      showSidebar: false,
    },
  },
  { path: '**', redirectTo: '' },
];
