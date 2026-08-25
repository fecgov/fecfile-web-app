import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionService } from 'app/shared/services/transaction.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { UnassociatedTransactionListComponent } from './unassociated-transaction-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TabsModule } from 'primeng/tabs';
import { PrimeTemplate } from 'primeng/api';
import { TransactionListComponent } from 'app/reports/transactions/transaction-list/transaction-list.component';
import { TransactionDisbursementsComponent } from 'app/reports/transactions/transaction-list/transaction-disbursements/transaction-disbursements.component';
import { TransactionLoansAndDebtsComponent } from 'app/reports/transactions/transaction-list/transaction-loans-and-debts/transaction-loans-and-debts.component';
import { TransactionReceiptsComponent } from 'app/reports/transactions/transaction-list/transaction-receipts/transaction-receipts.component';
import { UnassociatedTransactionListService } from 'app/shared/services/transaction-list-unassociated.service';
import { TRANSACTION_LIST_SERVICE } from 'app/shared/services/transaction-list.service';

describe('UnassociatedTransactionListComponent', () => {
  let component: UnassociatedTransactionListComponent;
  let fixture: ComponentFixture<UnassociatedTransactionListComponent>;
  const isCloneable = () => {
    return true;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToolbarModule,
        TableModule,
        ConfirmDialogModule,
        UnassociatedTransactionListComponent,
        TransactionListComponent,
        PrimeTemplate,
        TabsModule,
        TransactionReceiptsComponent,
        TransactionDisbursementsComponent,
        TransactionLoansAndDebtsComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore()),
        {
          provide: TransactionService,
          useValue: {
            get: () => undefined,
            getTableData: () => of([]),
            update: () => of([]),
            isCloneable,
          },
        },
        { provide: TRANSACTION_LIST_SERVICE, useClass: UnassociatedTransactionListService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
              params: {},
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassociatedTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
