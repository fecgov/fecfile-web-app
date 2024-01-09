import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { ReportIsEditableGuard } from '../../shared/guards/report-is-editable.guard';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { SidebarStateResolver } from 'app/shared/resolvers/sidebar-state.resolver';
import { TransactionIndependentExpenditurePickerComponent } from './transaction-independent-expenditure-picker/transaction-independent-expenditure-picker.component';

// ROUTING NOTE:
// Due to lifecycle conflict issues between the ReportIsEditableGuard and the
// ReportResolver, both the guard and the resovler read the :reportId in the URL
// and put the report for the ID in the ActiveReport value in the ngrx store. As a result:
// 1) The component will pull the active report from the ngrx store and not the ActivatedRoute.snapshot.
// 2) The ReportResolver should not be declared on routes with a ReportIsEditableGuard declared.

const routes: Routes = [
  {
    path: 'report/:reportId/transactions/select/independent-expenditures',
    component: TransactionIndependentExpenditurePickerComponent,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: {
      sidebarSection: ReportSidebarSection.TRANSACTIONS,
    },
    runGuardsAndResolvers: 'always',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class F24RoutingModule {}
