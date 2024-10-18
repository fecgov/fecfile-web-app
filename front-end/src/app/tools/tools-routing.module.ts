import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashOnHandOverrideComponent } from './cash-on-hand-override/cash-on-hand-override.component';

const routes: Routes = [
  {
    path: 'update-cash-on-hand',
    component: CashOnHandOverrideComponent,
    title: 'Update cash on hand',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolsRoutingModule { }
