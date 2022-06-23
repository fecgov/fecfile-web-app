import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { TransactionTypeResolver } from 'app/shared/resolvers/transaction-type.resolver';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';
import { TransactionTypePickerComponent } from './transaction-type-picker/transaction-type-picker.component';

const routes: Routes = [
  {
    path: 'report/:reportId/create',
    component: TransactionTypePickerComponent,
    resolve: {
      report: ReportResolver,
    },
  },
  {
    path: 'report/:reportId/create/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      transactionType: TransactionTypeResolver,
    },
  },
  {
    path: 'edit/:transactionId',
    component: TransactionContainerComponent,
    resolve: {
      transactionType: TransactionTypeResolver,
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
