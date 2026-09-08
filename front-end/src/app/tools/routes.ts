import { Route } from '@angular/router';
import { CashOnHandOverrideComponent } from './cash-on-hand-override/cash-on-hand-override.component';
import { ElectionCyclesListComponent } from './election-cycle/list/election-cycle-list.component';
import { electionCycleGuard } from './election-cycle/election-cycle.guard';
import { Form3Service } from 'app/shared/services/form-3.service';
import { ElectionCycleStore } from './election-cycle/election-cycle.store';
import { featureFlagGuard } from 'app/shared/guards/feature-flag.guard';

export const TOOLS_ROUTES: Route[] = [
  {
    path: 'update-cash-on-hand',
    component: CashOnHandOverrideComponent,
    title: 'Update cash on hand',
    pathMatch: 'full',
  },
  {
    path: 'election-cycles',
    component: ElectionCyclesListComponent,
    title: 'Election cycles',
    pathMatch: 'full',
    providers: [Form3Service, ElectionCycleStore],
    canActivate: [electionCycleGuard, featureFlagGuard('showForm3')],
  },
  { path: '**', redirectTo: '' },
];
