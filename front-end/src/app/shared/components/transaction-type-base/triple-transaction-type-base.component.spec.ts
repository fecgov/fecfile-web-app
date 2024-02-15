import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { TransactionService } from 'app/shared/services/transaction.service';
import { getTestTransactionByType, testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { SchCTransaction, ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { SchC1Transaction, ScheduleC1TransactionTypes } from 'app/shared/models/schc1-transaction.model';
import { TripleTransactionDetailComponent } from 'app/reports/transactions/triple-transaction-detail/triple-transaction-detail.component';
import { TripleTransactionTypeBaseComponent } from './triple-transaction-type-base.component';
import { of } from 'rxjs';
import { TransactionContactUtils } from './transaction-contact.utils';
import { Contact } from '../../models/contact.model';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from '../../models/transaction-navigation-controls.model';

let testTransaction: SchCTransaction;
let testConfirmationService: ConfirmationService;

// Spys
let confirmSpy: jasmine.Spy;

describe('TripleTransactionTypeBaseComponent', () => {
  let component: TripleTransactionTypeBaseComponent;
  let fixture: ComponentFixture<TripleTransactionTypeBaseComponent>;

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

    testConfirmationService = TestBed.inject(ConfirmationService);
    testTransaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK) as SchCTransaction;
    const child1 = getTestTransactionByType(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT) as SchC1Transaction;
    child1.treasurer_first_name = 'treas_fname';
    child1.treasurer_last_name = 'treas_lname';
    const child2 = getTestTransactionByType(
      ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT,
    ) as SchATransaction;
    testTransaction.report_id = '123';
    testTransaction.children = [child1, child2];
    fixture = TestBed.createComponent(TripleTransactionDetailComponent);
    component = fixture.componentInstance;
    component.transaction = testTransaction;
    fixture.detectChanges();

    confirmSpy = spyOn(testConfirmationService, 'confirm');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.transactionType?.title).toBe('Loan Received from Bank');
  });

  describe('confirmation$', () => {
    it('should return false if there is not child transaction 2', () => {
      component.childTransaction_2 = undefined;
      component.confirmation$.subscribe((res) => {
        expect(res).toBeFalse();
      });
    });

    it('should confirm with user 1 time if only primary transaction contact updated', fakeAsync(() => {
      if (!component.transaction) throw new Error('Bad test');
      component.transaction.contact_1 = testContact;
      component.confirmation$.subscribe((res) => {
        expect(res).toBeTrue();
      });
      tick(500);

      expect(confirmSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('isInvalid', () => {
    beforeEach(() => {
      component.childForm = new FormBuilder().group({});
    });

    it('should return true if super.isInvalid would fail', () => {
      component.form.addControl('Test', new FormControl(undefined, Validators.required));
      expect(component.form.invalid).toBeTrue();
      expect(component.isInvalid()).toBeTrue();
    });

    it('should return true if childForm_2 is invalid', () => {
      component.childForm = new FormBuilder().group({});
      expect(component.form.invalid).toBeFalse();
      expect(component.childForm.invalid).toBeFalse();
      expect(component.transaction).toBeTruthy();
      expect(component.childTransaction).toBeTruthy();
      component.childForm_2.addControl('Test', new FormControl(undefined, Validators.required));
      expect(component.childForm_2.invalid).toBeTrue();
      expect(component.isInvalid()).toBeTrue();
    });

    it('should return true if childTransaction_2 is missing', () => {
      component.childTransaction_2 = undefined;
      expect(component.form.invalid).toBeFalse();
      expect(component.childForm.invalid).toBeFalse();
      expect(component.childForm_2.invalid).toBeFalse();
      expect(component.transaction).toBeTruthy();
      expect(component.childTransaction).toBeTruthy();
      expect(component.childTransaction_2).toBeFalsy();
      expect(component.isInvalid()).toBeTrue();
    });

    it('should return false in all other cases', () => {
      expect(component.form.invalid).toBeFalse();
      expect(component.childForm.invalid).toBeFalse();
      expect(component.childForm_2.invalid).toBeFalse();
      expect(component.transaction).toBeTruthy();
      expect(component.childTransaction).toBeTruthy();
      expect(component.childTransaction_2).toBeTruthy();
      expect(component.isInvalid()).toBeFalse();
    });
  });

  describe('updateFormWithPrimaryContact', () => {
    it('should run the super version and then update data if ', () => {
      if (!component.childTransaction_2 || !component.transaction) throw new Error('Bad test');
      component.childTransaction_2.transactionType.useParentContact = true;
      component.transaction.contact_1 = testContact;
      expect(
        component.childTransaction_2?.transactionType?.getUseParentContact(component.childTransaction_2),
      ).toBeTruthy();
      expect(component.transaction.contact_1).toBeTruthy();
      const spy = spyOn(TransactionContactUtils, 'updateFormWithPrimaryContact');
      const selectItem: SelectItem<Contact> = { value: testContact };
      component.updateFormWithPrimaryContact(selectItem);
      expect(spy).toHaveBeenCalled();
      expect(component.childTransaction_2.contact_1).toEqual(component.transaction.contact_1);
    });
  });

  describe('childUpdateFormWithPrimaryContact_2', () => {
    it('should run the super version and then update data if ', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithPrimaryContact');
      const selectItem: SelectItem<Contact> = { value: testContact };
      component.childUpdateFormWithPrimaryContact_2(selectItem);
      expect(spy).toHaveBeenCalledWith(
        selectItem,
        component.childForm_2,
        component.childTransaction_2,
        component.childContactIdMap_2['contact_1'],
      );
    });
  });

  describe('childUpdateFormWithCandidateContact_2', () => {
    it('should run the super version and then update data if ', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithCandidateContact');
      const selectItem: SelectItem<Contact> = { value: testContact };
      component.childUpdateFormWithCandidateContact_2(selectItem);
      expect(spy).toHaveBeenCalledWith(
        selectItem,
        component.childForm_2,
        component.childTransaction_2,
        component.childContactIdMap_2['contact_2'],
      );
    });
  });

  describe('childUpdateFormWithSecondaryContact_2', () => {
    it('should run the super version and then update data if ', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithSecondaryContact');
      const selectItem: SelectItem<Contact> = { value: testContact };
      component.childUpdateFormWithSecondaryContact_2(selectItem);
      expect(spy).toHaveBeenCalledWith(
        selectItem,
        component.childForm_2,
        component.childTransaction_2,
        component.childContactIdMap_2['contact_2'],
      );
    });
  });

  describe('childUpdateFormWithTertiaryContact_2', () => {
    it('should run the super version and then update data if ', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithSecondaryContact');
      const selectItem: SelectItem<Contact> = { value: testContact };
      component.childUpdateFormWithTertiaryContact_2(selectItem);
      expect(spy).toHaveBeenCalledWith(
        selectItem,
        component.childForm_2,
        component.childTransaction_2,
        component.childContactIdMap_2['contact_3'],
      );
    });
  });

  describe('save', () => {
    it('should bail out if transactions are invalid', () => {
      component.transaction = undefined;
      expect(function () {
        component.save(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction));
      }).toThrow(new Error('Fecfile: No transactions submitted for triple-entry transaction form.'));
    });
  });
});
