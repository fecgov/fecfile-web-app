import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { TransactionResolver } from 'app/shared/resolvers/transaction.resolver';
import { ReportIsEditableGuard } from 'app/shared/guards/report-is-editable.guard';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { ReportSidebarState, SidebarState } from 'app/layout/sidebar/sidebar.component';
import { SidebarStateResolver } from 'app/shared/resolvers/sidebar-state.resolver';

// ROUTING NOTE:
// Due to lifecycle conflict issues between the ReportIsEditableGuard and the
// ReportResolver, both the guard and the resovler read the :reportId in the URL
// and put the report for the ID in the ActiveReport value in the ngrx store. As a result:
// 1) The component will pull the active report from the ngrx store and not the ActivatedRoute.snapshot.
// 2) The ReportResolver should not be declared on routes with a ReportIsEditableGuard declared.

const routes: Routes = [
  {
    path: 'report/:reportId/list',
    title: 'Manage your transactions',
    component: TransactionListComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: {
      sidebarState: new SidebarState(ReportSidebarState.TRANSACTIONS),
    },
  },
  {
    path: 'report/:reportId/select/:category',
    component: TransactionTypePickerComponent,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: {
      sidebarState: new SidebarState(ReportSidebarState.TRANSACTIONS),
    },
  },
  {
    path: 'report/:reportId/create/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      transaction: TransactionResolver,
      sidebar: SidebarStateResolver,
    },
    data: {
      sidebarState: new SidebarState(ReportSidebarState.TRANSACTIONS),
    },
    canActivate: [ReportIsEditableGuard],
  },
  {
    path: 'report/:reportId/list/:transactionId',
    component: TransactionContainerComponent,
    resolve: {
      transaction: TransactionResolver,
      sidebar: SidebarStateResolver,
    },
    data: {
      sidebarState: new SidebarState(ReportSidebarState.TRANSACTIONS),
    },
  },
  {
    path: 'report/:reportId/list/:parentTransactionId/create-sub-transaction/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      transaction: TransactionResolver,
      sidebar: SidebarStateResolver,
    },
    canActivate: [ReportIsEditableGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
