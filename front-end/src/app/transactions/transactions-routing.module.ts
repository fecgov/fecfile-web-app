import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionResolver } from 'app/shared/resolvers/transaction.resolver';
import { TransactionContainerComponent } from './transaction-container/transaction-container.component';

const routes: Routes = [
  {
    path: 'report/:reportId/create/:transactionType',
    component: TransactionContainerComponent,
    resolve: {
      transaction: TransactionResolver,
    },
  },
  {
    path: 'report/:reportId/edit/:transactionId',
    component: TransactionContainerComponent,
    resolve: {
      transaction: TransactionResolver,
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
