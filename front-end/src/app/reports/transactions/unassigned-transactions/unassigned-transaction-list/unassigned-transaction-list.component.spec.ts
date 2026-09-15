import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionService } from 'app/shared/services/transaction.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TabsModule } from 'primeng/tabs';
import { PrimeTemplate } from 'primeng/api';
import { TransactionListComponent } from 'app/reports/transactions/transaction-list/transaction-list.component';
import { UnassignedTransactionListComponent } from './unassigned-transaction-list.component';
import { TransactionListTableComponent } from '../../transaction-list/transaction-list-table/transaction-list-table.component';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { TransactionListService } from 'app/shared/services/transaction-list.service';
import {
  BaseTransactionActionsFactory,
  UnassignedTransactionActionsFactory,
} from '../../transaction-list/transaction-list-table/transaction-actions';
import { TransactionColumnFactory } from '../../transaction-list/transaction-list-table/transaction-column.factory';

describe('UnassignedTransactionListComponent', () => {
  let component: UnassignedTransactionListComponent;
  let fixture: ComponentFixture<UnassignedTransactionListComponent>;
  const isCloneable = () => {
    return true;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToolbarModule,
        TableModule,
        ConfirmDialogModule,
        UnassignedTransactionListComponent,
        TransactionListComponent,
        PrimeTemplate,
        TabsModule,
        TransactionListTableComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore()),
        { provide: BaseTransactionActionsFactory, useClass: UnassignedTransactionActionsFactory },
        TransactionColumnFactory,
        BreakpointStore,
        {
          provide: TransactionService,
          useValue: {
            get: () => undefined,
            getTableData: () => of([]),
            update: () => of([]),
            isCloneable,
          },
        },
        TransactionListService,
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
    fixture = TestBed.createComponent(UnassignedTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
