import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const HELP_ROUTES = [{ path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forChild(HELP_ROUTES)],
  exports: [RouterModule],
})
export class HelpRoutingModule {}
