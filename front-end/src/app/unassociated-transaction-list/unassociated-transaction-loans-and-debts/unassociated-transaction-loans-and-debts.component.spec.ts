import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { TransactionSchCService } from 'app/shared/services/transaction-schC.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { UnassociatedTransactionLoansAndDebtsComponent } from './unassociated-transaction-loans-and-debts.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReportService } from 'app/shared/services/report.service';

describe('UnassociatedTransactionLoansAndDebtsComponent', () => {
  let fixture: ComponentFixture<UnassociatedTransactionLoansAndDebtsComponent>;
  let component: UnassociatedTransactionLoansAndDebtsComponent;
  let reportService: ReportService<Form3X>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SelectModule, FormsModule, UnassociatedTransactionLoansAndDebtsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore()),
        TransactionSchCService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassociatedTransactionLoansAndDebtsComponent);
    reportService = TestBed.inject(ReportService);
    vi.spyOn(reportService, 'isEditable').mockReturnValue(true);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
