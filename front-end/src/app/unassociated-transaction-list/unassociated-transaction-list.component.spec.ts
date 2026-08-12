import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { UnassociatedTransactionListComponent } from './unassociated-transaction-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UnassociatedTransactionReceiptsComponent } from './unassociated-transaction-receipts/unassociated-transaction-receipts.component';
import { UnassociatedTransactionDisbursementsComponent } from './unassociated-transaction-disbursements/unassociated-transaction-disbursements.component';
import { UnassociatedTransactionLoansAndDebtsComponent } from './unassociated-transaction-loans-and-debts/unassociated-transaction-loans-and-debts.component';
import { TabsModule } from 'primeng/tabs';
import { PrimeTemplate } from 'primeng/api';
import { TableActionsButtonComponent } from '../shared/components/table-actions-button/table-actions-button.component';

describe('UnassociatedTransactionListComponent', () => {
  let component: UnassociatedTransactionListComponent;
  let fixture: ComponentFixture<UnassociatedTransactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToolbarModule,
        TableModule,
        UnassociatedTransactionListComponent,
        PrimeTemplate,
        TabsModule,
        TableActionsButtonComponent,
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
