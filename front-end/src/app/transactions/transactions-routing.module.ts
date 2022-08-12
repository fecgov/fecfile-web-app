import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { TransactionTypeResolver } from 'app/shared/resolvers/transaction-type.resolver';
import { ReportIsEditableGuard } from '../shared/guards/report-is-editable.guard';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

const routes: Routes = [
  {
    path: 'report/:reportId/list',
    component: TransactionListComponent,
    resolve: { report: ReportResolver },
  },
  {
    path: 'report/:reportId/create',
    component: TransactionTypePickerComponent,
    resolve: {
      report: ReportResolver,
    },
    canActivate: [ReportIsEditableGuard]
  },
  {
    path: 'report/:reportId/create/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      transactionType: TransactionTypeResolver,
    },
    canActivate: [ReportIsEditableGuard]
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
    canActivate: [ReportIsEditableGuard]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
