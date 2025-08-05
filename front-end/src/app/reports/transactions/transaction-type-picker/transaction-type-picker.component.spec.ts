import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Form3X } from 'app/shared/models/form-3x.model';
import { AccordionModule } from 'primeng/accordion';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { TransactionTypePickerComponent } from './transaction-type-picker.component';
import { BehaviorSubject, of } from 'rxjs';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Disbursement, LoansAndDebts, Receipt } from 'app/shared/models/transaction-group';

describe('TransactionTypePickerComponent', () => {
  let component: TransactionTypePickerComponent;
  let fixture: ComponentFixture<TransactionTypePickerComponent>;
  const routeParams$ = new BehaviorSubject({ category: 'receipt' });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule, BrowserAnimationsModule, TransactionTypePickerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form3X.fromJSON({
                  report_type: ReportTypes.F3X,
                }),
              },
            },
            params: routeParams$.asObservable(),
            queryParamMap: of({ get: (key: string) => (key === 'param1' ? 'value1' : undefined) }),
          },
        },
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change for disbursement category', fakeAsync(() => {
    routeParams$.next({ category: 'disbursement' });
    fixture.detectChanges();
    tick(500);
    const groups = component.transactionGroups();
    expect(groups[0]).toBe(Disbursement.OPERATING_EXPENDITURES);
  }));

  it('should change for loans and debts category', () => {
    routeParams$.next({ category: 'loans-and-debts' });
    const groups = component.transactionGroups();
    expect(groups[0]).toBe(LoansAndDebts.LOANS);

    let types = component.transactionTypes().get(groups[0]);
    expect(types![0]).toBe(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL);
    types = component.transactionTypes().get(groups[1]);
    expect(types![0]).toBe(ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE);
  });

  it('should set the title correctly', () => {
    routeParams$.next({ category: 'receipt' });
    expect(component.title()).toEqual('Add a receipt');
    routeParams$.next({ category: 'disbursement' });
    expect(component.title()).toEqual('Add a disbursement');
    routeParams$.next({ category: 'loans-and-debts' });
    expect(component.title()).toEqual('Add loans and debts');
  });

  describe('getTransactionTypes', () => {
    it('should limit by PACRestricted if Committee type is PAC', fakeAsync(() => {
      routeParams$.next({ category: 'receipt' });
      const types = component.transactionTypes().get(Receipt.TRANSFERS);
      expect(types!.includes(ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY)).toBeFalse();
    }));

    it('should limit by PTY_ONLY if Committee type is PTY', fakeAsync(() => {
      routeParams$.next({ category: 'receipt' });
      const types = component.transactionTypes().get(Receipt.OTHER);
      expect(types!.includes(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT)).toBeFalse();
    }));
  });
});
