import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Form3X } from 'app/shared/models/form-3x.model';
import { AccordionModule } from 'primeng/accordion';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { TransactionTypePickerComponent } from './transaction-type-picker.component';
import { BehaviorSubject, of } from 'rxjs';
import { ScheduleBTransactionGroups } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionGroups, ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { Form24 } from 'app/shared/models/form-24.model';
import { ScheduleETransactionGroups } from 'app/shared/models/sche-transaction.model';
import { ScheduleATransactionGroups, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { selectActiveReport } from 'app/store/active-report.selectors';

describe('TransactionTypePickerComponent', () => {
  let component: TransactionTypePickerComponent;
  let fixture: ComponentFixture<TransactionTypePickerComponent>;
  let mockStore: MockStore;
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
        provideMockStore(testMockStore),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypePickerComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
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
    expect(groups[0]).toBe(ScheduleBTransactionGroups.OPERATING_EXPENDITURES);
  }));

  it('should show only independent expenditures when in an F24', () => {
    mockStore.overrideSelector(
      selectActiveReport,
      Form24.fromJSON({
        report_type: ReportTypes.F24,
      }),
    );
    mockStore.refreshState();
    routeParams$.next({ category: 'disbursement' });
    fixture.detectChanges();

    const groups = component.transactionGroups();
    expect(groups[0]).toBe(ScheduleETransactionGroups.INDEPENDENT_EXPENDITURES);
    expect(groups.length).toEqual(1);
  });

  it('should change for loans and debts category', () => {
    routeParams$.next({ category: 'loans-and-debts' });
    const groups = component.transactionGroups();
    expect(groups[0]).toBe(ScheduleCTransactionGroups.LOANS);

    let types = component.getTransactionTypes(groups[0]);
    expect(types[0]).toBe(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL);
    types = component.getTransactionTypes(groups[1]);
    expect(types[0]).toBe(ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE);
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
      const types = component.getTransactionTypes(ScheduleATransactionGroups.TRANSFERS);
      expect(types.includes(ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY)).toBeFalse();
    }));

    it('should limit by PTY_ONLY if Committee type is PTY', fakeAsync(() => {
      const testTypes = component.getTransactionTypes(ScheduleATransactionGroups.OTHER);
      expect(testTypes.includes(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT)).toBeFalse();
    }));
  });
});
