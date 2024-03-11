import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionResolver } from 'app/shared/resolvers/transaction.resolver';
import { ReportIsEditableGuard } from 'app/shared/guards/report-is-editable.guard';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';

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
    resolve: { report: ReportResolver },
    data: {
      sidebarSection: ReportSidebarSection.TRANSACTIONS,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'report/:reportId/select/:category',
    component: TransactionTypePickerComponent,
    resolve: { report: ReportResolver },
    canActivate: [ReportIsEditableGuard],
    data: {
      sidebarSection: ReportSidebarSection.TRANSACTIONS,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'report/:reportId/create/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      report: ReportResolver,
      transaction: TransactionResolver,
    },
    data: {
      sidebarSection: ReportSidebarSection.TRANSACTIONS,
    },
    canActivate: [ReportIsEditableGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'report/:reportId/list/:transactionId',
    component: TransactionContainerComponent,
    resolve: {
      report: ReportResolver,
      transaction: TransactionResolver,
    },
    data: {
      sidebarSection: ReportSidebarSection.TRANSACTIONS,
      noComponentReuse: true,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'report/:reportId/list/:parentTransactionId/create-sub-transaction/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      report: ReportResolver,
      transaction: TransactionResolver,
    },
    canActivate: [ReportIsEditableGuard],
    // There is a scenario where a memo is saved and then navigates to create
    // a sibling transaction of a different transaction type, the below setting ensures
    // the transaction form components are destroyed and recreated so initialization
    // of the new transaction form happens correctly.
    data: { noComponentReuse: true }, // Handled in src/app/custom-route-reuse-strategy.ts
    runGuardsAndResolvers: 'always',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
