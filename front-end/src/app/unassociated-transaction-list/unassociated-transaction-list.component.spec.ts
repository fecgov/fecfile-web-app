import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { UnassociatedTransactionListComponent } from './unassociated-transaction-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UnassociatedTransactionListComponent', () => {
  let component: UnassociatedTransactionListComponent;
  let fixture: ComponentFixture<UnassociatedTransactionListComponent>;
  let router: Router;
  const isCloneable = vi.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, ConfirmDialogModule, UnassociatedTransactionListComponent],
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
            get: (transactionId: string) =>
              of(
                SchATransaction.fromJSON({
                  id: transactionId,
                  transaction_type_identifier: 'OFFSET_TO_OPERATING_EXPENDITURES',
                }),
              ),
            getTableData: () => of([]),
            update: () => of([]),
            isCloneable,
          },
        },
        {
          provide: ActivatedRoute,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    isCloneable.mockReset();
    isCloneable.mockReturnValue(true);
    fixture = TestBed.createComponent(UnassociatedTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
