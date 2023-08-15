import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { SchCTransaction, ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { SchC1Transaction, ScheduleC1TransactionTypes } from 'app/shared/models/schc1-transaction.model';
import { TripleTransactionDetailComponent } from 'app/reports/transactions/triple-transaction-detail/triple-transaction-detail.component';
import { TripleTransactionTypeBaseComponent } from './triple-transaction-type-base.component';
import { of } from 'rxjs';

let testTransaction: SchCTransaction;

describe('TripleTransactionTypeBaseComponent', () => {
  let component: TripleTransactionTypeBaseComponent;
  let fixture: ComponentFixture<TripleTransactionTypeBaseComponent>;
  let testConfirmationService: ConfirmationService;

  //spys
  let navigateToSpy: jasmine.Spy;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let confirmSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripleTransactionDetailComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        DatePipe,
        MessageService,
        FormBuilder,
        {
          provide: TransactionService,
          useValue: jasmine.createSpyObj('TransactionService', {
            update: of(undefined),
            create: of(undefined),
            getPreviousTransaction: of(undefined),
          }),
        },
        ConfirmationService,
        provideMockStore(testMockStore),
        FecDatePipe,
      ],
    }).compileComponents();

    transactionServiceSpy = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    testConfirmationService = TestBed.inject(ConfirmationService);

    testTransaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK) as SchCTransaction;
    const child1 = getTestTransactionByType(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT) as SchC1Transaction;
    child1.treasurer_first_name = 'treas_fname';
    child1.treasurer_last_name = 'treas_lname';
    const child2 = getTestTransactionByType(
      ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT
    ) as SchATransaction;
    testTransaction.report_id = '123';
    testTransaction.children = [child1, child2];
    fixture = TestBed.createComponent(TripleTransactionDetailComponent);
    component = fixture.componentInstance;
    component.transaction = testTransaction;
    fixture.detectChanges();

    navigateToSpy = spyOn(component, 'navigateTo');
    confirmSpy = spyOn(testConfirmationService, 'confirm');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.transactionType?.title).toBe('Loan Received from Bank');
  });

  xit('should save on save event', fakeAsync(() => {
    if (component.transaction) transactionServiceSpy.create.and.returnValue(of(component.transaction));
    confirmSpy.and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    expect(component.form.invalid).toBeFalse();
    const listSaveEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
    component.handleNavigate(listSaveEvent);
    tick(500);
    expect(transactionServiceSpy.create).toHaveBeenCalled();
    expect(navigateToSpy).toHaveBeenCalled();
  }));
});
