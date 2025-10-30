import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Form3X } from 'app/shared/models/form-3x.model';
import { AccordionModule } from 'primeng/accordion';
import { provideMockStore } from '@ngrx/store/testing';
import {
  testF3,
  testMockStore,
  testNavigationEvent,
  testPTY,
  testUserLoginData,
} from 'app/shared/utils/unit-test.utils';
import { TransactionTypePickerComponent } from './transaction-type-picker.component';
import { BehaviorSubject, of } from 'rxjs';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Disbursement, LoansAndDebts, Receipt } from 'app/shared/models/transaction-group';
import { Form3 } from 'app/shared/models';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { selectNavigationEvent } from 'app/store/navigation-event.selectors';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';

describe('TransactionTypePickerComponent', () => {
  let component: TransactionTypePickerComponent;
  let fixture: ComponentFixture<TransactionTypePickerComponent>;
  const routeParams$ = new BehaviorSubject({ category: 'receipt' });

  describe('f3x', () => {
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

    it('should change for disbursement category', () => {
      routeParams$.next({ category: 'disbursement' });
      fixture.detectChanges();

      const groups = component.transactionGroups();
      expect(groups[0]).toBe(Disbursement.OPERATING_EXPENDITURES);
    });

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

    it('should limit by PACRestricted if Committee type is PAC', () => {
      routeParams$.next({ category: 'receipt' });
      const types = component.transactionTypes().get(Receipt.TRANSFERS);
      expect(types!.includes(ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY)).toBeFalse();
    });

    it('should limit by PTY_ONLY if Committee type is PTY', () => {
      routeParams$.next({ category: 'receipt' });
      const types = component.transactionTypes().get(Receipt.OTHER);
      expect(types!.includes(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT)).toBeFalse();
    });
  });

  describe('f3', () => {
    const store = testMockStore();
    store.selectors = [
      { selector: selectCommitteeAccount, value: testPTY() },
      { selector: selectUserLoginData, value: testUserLoginData() },
      { selector: selectActiveReport, value: testF3() },
      { selector: selectNavigationEvent, value: testNavigationEvent() },
    ];
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
                  report: Form3.fromJSON({
                    report_type: ReportTypes.F3,
                  }),
                },
              },
              params: routeParams$.asObservable(),
              queryParamMap: of({ get: (key: string) => (key === 'param1' ? 'value1' : undefined) }),
            },
          },
          provideMockStore(store),
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TransactionTypePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should change for disbursement category', () => {
      spyOn(component, 'showTransaction').and.returnValue(true);
      routeParams$.next({ category: 'disbursement' });
      fixture.detectChanges();
      expect(component.isF3()).toBeTrue();
      const groups = component.transactionGroups();
      expect(groups.length).toBe(4);
      const transTypes = component.transactionTypes();
      const contributions = transTypes.get(Disbursement.CONTRIBUTIONS_EXPENDITURES_TO_REGISTERED_FILERS);
      contributions?.forEach((c) => console.log(c));
      expect(transTypes.get(Disbursement.CONTRIBUTIONS_EXPENDITURES_TO_REGISTERED_FILERS)?.length).toBe(3);
    });
  });
});
