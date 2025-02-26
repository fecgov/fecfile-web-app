import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { TransactionGuarantorsComponent } from './transaction-guarantors.component';
import { TransactionSchC2Service } from 'app/shared/services/transaction-schC2.service';
import { SchC2Transaction } from 'app/shared/models/schc2-transaction.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TransactionGuarantorsComponent', () => {
  let fixture: ComponentFixture<TransactionGuarantorsComponent>;
  let component: TransactionGuarantorsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SelectModule, FormsModule, TransactionGuarantorsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form3X.fromJSON({}),
              },
              params: {
                reportId: '999',
              },
            },
          },
        },
        {
          provide: TransactionSchC2Service,
          useValue: {
            get: (transactionId: string) =>
              of(
                SchC2Transaction.fromJSON({
                  id: transactionId,
                  transaction_type_identifier: 'LOAN_GUARANTOR',
                }),
              ),
            getTableData: () => of([]),
            update: () => of([]),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGuarantorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.getParams()['parent']).toBeUndefined();
  });

  it('should load items with loan', () => {
    component.loan = { id: '1' } as Transaction;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.getParams()['parent']).toEqual('1');
  });

  it('should have delete', () => {
    component.reportIsEditable = true;
    expect(component.rowActions[0].isAvailable()).toEqual(false);
    expect(component.rowActions[1].isAvailable()).toEqual(true);
    expect(component.rowActions[2].isAvailable()).toEqual(true);
    expect(component.rowActions[0].isEnabled({})).toEqual(true);
    expect(component.rowActions[1].isEnabled({})).toEqual(true);
    expect(component.rowActions[2].isEnabled({})).toEqual(true);
  });
});
