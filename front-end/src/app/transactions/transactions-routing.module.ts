import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { TransactionTypeResolver } from 'app/shared/resolvers/transaction-type.resolver';
import { ReportIsEditableGuard } from '../shared/guards/report-is-editable.guard';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

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
  },
  {
    path: 'report/:reportId/select/:category',
    component: TransactionTypePickerComponent,
    canActivate: [ReportIsEditableGuard],
  },
  {
    path: 'report/:reportId/create/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      transactionType: TransactionTypeResolver,
    },
    canActivate: [ReportIsEditableGuard],
  },
  {
    path: 'report/:reportId/list/edit/:transactionId',
    component: TransactionContainerComponent,
    resolve: {
      transactionType: TransactionTypeResolver,
    },
  },
  {
    path: 'report/:reportId/list/edit/:parentTransactionId/create-sub-transaction/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      transactionType: TransactionTypeResolver,
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
