import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { UnassociatedTransactionListComponent } from './unassociated-transaction-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReportStatus, ReportTypes } from 'app/shared/models/reports/report.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MemoCodePipe } from 'app/shared/pipes/memo-code.pipe';
import { Form24 } from 'app/shared/models';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { UnassociatedTransactionReceiptsComponent } from './unassociated-transaction-receipts/unassociated-transaction-receipts.component';
import { UnassociatedTransactionDisbursementsComponent } from './unassociated-transaction-disbursements/unassociated-transaction-disbursements.component';
import { UnassociatedTransactionLoansAndDebtsComponent } from './unassociated-transaction-loans-and-debts/unassociated-transaction-loans-and-debts.component';
import { Toolbar } from 'primeng/toolbar';
import { TabsModule } from 'primeng/tabs';
import { PrimeTemplate } from 'primeng/api';
import { TransactionListComponent } from 'app/reports/transactions/transaction-list/transaction-list.component';

describe('UnassociatedTransactionListComponent', () => {
  let component: UnassociatedTransactionListComponent;
  let fixture: ComponentFixture<UnassociatedTransactionListComponent>;
  let router: Router;
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
        UnassociatedTransactionReceiptsComponent,
        UnassociatedTransactionDisbursementsComponent,
        UnassociatedTransactionLoansAndDebtsComponent,
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
            get: (transactionId: string) => undefined,
            getTableData: () => of([]),
            update: () => of([]),
            isCloneable,
          },
        },
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
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
