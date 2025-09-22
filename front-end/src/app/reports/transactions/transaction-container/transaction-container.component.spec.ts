import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { getTestTransactionByType, testActiveReport, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { BehaviorSubject } from 'rxjs';
import { TransactionContainerComponent } from './transaction-container.component';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { ReportService } from 'app/shared/services/report.service';
import {
  Report,
  SchATransaction,
  SchCTransaction,
  ScheduleATransactionTypes,
  ScheduleCTransactionTypes,
  Transaction,
  TransactionTypes,
} from 'app/shared/models';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReattRedesTypes } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TransactionService } from 'app/shared/services/transaction.service';

const mockTransaction = getTestTransactionByType(
  ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
) as SchATransaction;

const routeDataSubject = new BehaviorSubject<{ transaction?: Transaction | null }>({ transaction: mockTransaction });

const routeMock = {
  data: routeDataSubject.asObservable(),
  snapshot: {
    queryParamMap: {
      get: () => 'b49f0957-4404-4237-95ec-0df053083b19',
    },
    params: {
      reportId: '999',
    },
  },
};

describe('TransactionContainerComponent', () => {
  let component: TransactionContainerComponent;
  let fixture: ComponentFixture<TransactionContainerComponent>;
  let titleSpy: jasmine.Spy<(newTitle: string) => void>;
  let isEditableSpy: jasmine.Spy<(report: Report | undefined) => boolean>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        DividerModule,
        SelectModule,
        ButtonModule,
        DatePickerModule,
        CheckboxModule,
        InputTextModule,
        InputNumberModule,
        ConfirmDialogModule,
        TransactionContainerComponent,
        ConfirmDialog,
        TransactionDetailComponent,
      ],
      providers: [
        provideAnimationsAsync(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        FormBuilder,
        MessageService,
        ReportService,
        ConfirmationService,
        TransactionService,
        Title,
        {
          provide: ActivatedRoute,
          useValue: routeMock,
        },
        provideMockStore(testMockStore()),
        FecDatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const title = TestBed.inject(Title);
    titleSpy = spyOn(title, 'setTitle');
    const reportService = TestBed.inject(ReportService);
    isEditableSpy = spyOn(reportService, 'isEditable');
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TransactionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page title based on the transaction type', () => {
    routeDataSubject.next({ transaction: mockTransaction });
    fixture.detectChanges();
    expect(titleSpy).toHaveBeenCalledWith('Offsets to Operating Expenditures');
  });

  it('should correctly determine if the report is editable', () => {
    isEditableSpy.and.returnValue(true);
    store.overrideSelector(selectActiveReport, testActiveReport());
    store.refreshState();
    expect(component.isEditableReport()).toBeTrue();

    isEditableSpy.and.returnValue(false);
    store.overrideSelector(selectActiveReport, testActiveReport());
    store.refreshState();
    expect(component.isEditableReport()).toBeFalse();
  });

  it('should get the transaction from the route data', () => {
    routeDataSubject.next({ transaction: mockTransaction });
    fixture.detectChanges();
    expect(component.transaction()).toEqual(mockTransaction);
  });

  describe('transactionCardinality', () => {
    it('should return -1 for a new Re-Att/Re-Des transaction without an ID', () => {
      const child = getTestTransactionByType(
        ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      ) as SchATransaction;
      const reatt = getTestTransactionByType(
        ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      ) as SchATransaction;
      reatt.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATION_TO;
      reatt.transactionType.dependentChildTransactionTypes = [reatt.transaction_type_identifier as TransactionTypes];
      reatt.children = [child];
      reatt.reatt_redes = child;
      routeDataSubject.next({ transaction: reatt });
      fixture.detectChanges();
      expect(component.transactionCardinality()).toBe(-1);
    });

    it('should return 1 for a pulled forward loan', () => {
      const originalLoan = getTestTransactionByType(
        ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
      ) as SchCTransaction;
      const loanTransaction = getTestTransactionByType(
        ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
      ) as SchCTransaction;
      loanTransaction.transactionType.dependentChildTransactionTypes = [
        loanTransaction.transaction_type_identifier as TransactionTypes,
      ];
      loanTransaction.children = [originalLoan];
      loanTransaction.loan_id = '111';
      routeDataSubject.next({ transaction: loanTransaction });
      fixture.detectChanges();
      expect(component.transactionCardinality()).toBe(1);
    });

    it('should return 2 for a transaction with one dependent child', () => {
      const child = getTestTransactionByType(
        ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      ) as SchATransaction;
      const parent = getTestTransactionByType(
        ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      ) as SchATransaction;
      parent.transactionType.dependentChildTransactionTypes = [child.transaction_type_identifier as TransactionTypes];
      parent.children = [child];
      routeDataSubject.next({ transaction: parent });
      fixture.detectChanges();
      expect(component.transactionCardinality()).toBe(2);
    });

    it('should return 3 for a transaction with two dependent children', () => {
      const child = getTestTransactionByType(
        ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      ) as SchATransaction;
      const child2 = getTestTransactionByType(
        ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      ) as SchATransaction;
      const parent = getTestTransactionByType(
        ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      ) as SchATransaction;
      parent.transactionType.dependentChildTransactionTypes = [
        child.transaction_type_identifier as TransactionTypes,
        child2.transaction_type_identifier as TransactionTypes,
      ];
      parent.children = [child, child2];
      routeDataSubject.next({ transaction: parent });
      fixture.detectChanges();
      expect(component.transactionCardinality()).toBe(3);
    });

    it('should return 1 for a transaction with no dependent children', () => {
      routeDataSubject.next({ transaction: mockTransaction });
      fixture.detectChanges();
      expect(component.transactionCardinality()).toBe(1);
    });
  });
});
