import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { testIndividualReceipt, testMockStore, getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { SchATransaction, ScheduleATransactionTypes } from '../../models/scha-transaction.model';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { TransactionDetailComponent } from 'app/reports/transactions/transaction-detail/transaction-detail.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';

let testTransaction: SchATransaction;

describe('TransactionTypeBaseComponent', () => {
  let component: TransactionTypeBaseComponent;
  let fixture: ComponentFixture<TransactionTypeBaseComponent>;
  let testConfirmationService: ConfirmationService;

  //spys
  let navigateToSpy: jasmine.Spy;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let confirmSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDetailComponent],
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

    testTransaction = testIndividualReceipt;
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    component.transaction = testTransaction;
    fixture.detectChanges();

    navigateToSpy = spyOn(component, 'navigateTo');
    confirmSpy = spyOn(testConfirmationService, 'confirm');
  });

  it('should initialize Individual Receipt', () => {
    expect(component).toBeTruthy();
    expect(component.transactionType?.title).toBe('Individual Receipt');
  });

  it('should save on save event', fakeAsync(() => {
    if (component.transaction) transactionServiceSpy.update.and.returnValue(of(component.transaction));
    confirmSpy.and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    expect(component.form.invalid).toBeFalse();
    const listSaveEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
    component.handleNavigate(listSaveEvent);
    tick(500);
    expect(transactionServiceSpy.update).toHaveBeenCalled();
    expect(navigateToSpy).toHaveBeenCalled();
  }));

  it('positive contribution_amount values should be overriden when the schema requires a negative value', () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
    component.ngOnInit();

    component.form.patchValue({ contribution_amount: 2 });
    expect(component.form.get('contribution_amount')?.value).toBe(-2);
  });
});
