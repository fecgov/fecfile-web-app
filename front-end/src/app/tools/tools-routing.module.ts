import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const TOOLS_ROUTES = [{ path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forChild(TOOLS_ROUTES)],
  exports: [RouterModule],
})
export class ToolsRoutingModule {}
