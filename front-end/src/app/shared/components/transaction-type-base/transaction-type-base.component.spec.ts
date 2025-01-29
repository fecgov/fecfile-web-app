import { DatePipe } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { getTestIndividualReceipt, getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { of } from 'rxjs';
import { SchATransaction, ScheduleATransactionTypes } from '../../models/scha-transaction.model';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { TransactionDetailComponent } from 'app/reports/transactions/transaction-detail/transaction-detail.component';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { Contact, ContactTypes } from '../../models/contact.model';
import { TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionType } from '../../models/transaction-type.model';
import { ActivatedRoute, NavigationBehaviorOptions, Router } from '@angular/router';
import { Transaction } from '../../models/transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

let testTransaction: SchATransaction;

describe('TransactionTypeBaseComponent', () => {
  let component: TransactionTypeBaseComponent;
  let fixture: ComponentFixture<TransactionTypeBaseComponent>;
  let testConfirmationService: ConfirmationService;

  // spies
  let navigateToSpy: jasmine.Spy;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let confirmSpy: jasmine.Spy;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  let navEvent: NavigationEvent;
  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDetailComponent],
      providers: [
        provideMockStore(testMockStore),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        DatePipe,
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { reportId: '999' } },
          },
        },
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj('MessageService', {
            add: (message: { severity: string; summary: string; detail: string; life: number }) => {
              console.log(message.summary);
            },
          }),
        },
        FormBuilder,
        {
          provide: TransactionService,
          useValue: jasmine.createSpyObj('TransactionService', {
            update: of(undefined),
            create: of(undefined),
            getPreviousTransactionForAggregate: Promise.resolve(undefined),
          }),
        },
        ConfirmationService,
        provideMockStore(testMockStore),
        FecDatePipe,
      ],
    }).compileComponents();

    transactionServiceSpy = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
    testConfirmationService = TestBed.inject(ConfirmationService);
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    testTransaction = getTestIndividualReceipt();
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    component.transaction = testTransaction;

    navigateToSpy = spyOn(component, 'navigateTo');
    confirmSpy = spyOn(testConfirmationService, 'confirm');
  });

  describe('init', () => {
    it('should initialize Individual Receipt', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.transactionType?.title).toBe('Individual Receipt');
    });

    it('should throw an error if the transaction template map is unavailable', async () => {
      component.transaction = undefined;
      try {
        component.ngOnInit();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        expect(err.message).toBe('Fecfile: Template map not found for transaction component');
      }
    });

    it('should set the contact type options', async () => {
      component.ngOnInit();
      expect(component.contactTypeOptions).toContain({ value: ContactTypes.INDIVIDUAL, label: 'Individual' });
      expect(component.contactTypeOptions.length).toEqual(1);
    });
  });

  it('positive contribution_amount values should be overridden when the schema requires a negative value', async () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
    component.ngOnInit();

    component.form.patchValue({ contribution_amount: 2 });
    expect(component.form.get('contribution_amount')?.value).toBe(-2);
  });

  it('inherited fields should use the parent transaction to initialize the form values', async () => {
    component.transaction = getTestTransactionByType(ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE);
    component.transaction.parent_transaction = getTestIndividualReceipt();
    if (component.transaction.parent_transaction.contact_1)
      component.transaction.parent_transaction.contact_1.street_1 = 'Parent Street 1';
    component.ngOnInit();
    expect(component.transaction.contact_1?.street_1).toBe('Parent Street 1');
    expect(component.transaction.contact_1_id).toBe('testId');
  });

  describe('save', () => {
    beforeEach(() => {
      navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
    });

    it('should update contacts form if there is a transaction', async () => {
      const contactSpy = spyOn(TransactionContactUtils, 'updateContactsWithForm');
      await component.save(navEvent);
      expect(contactSpy).toHaveBeenCalled();
    });

    it('should stop processing and throw an error if there is no transaction', async () => {
      component.transaction = undefined;
      await expectAsync(component.save(navEvent)).toBeRejectedWithError(
        'Fecfile: No transactions submitted for single-entry transaction form.',
      );
    });
  });

  describe('processPayload', () => {
    beforeEach(() => {
      navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
    });

    it('should set processing to false if no transaction type identifier on payload', async () => {
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        '999',
        component.form,
        component.formProperties,
      );
      payload.transaction_type_identifier = undefined;
      await component.processPayload(payload, navEvent);
    });

    it('should update data and then set processing to false', async () => {
      component.ngOnInit();
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        '999',
        component.form,
        component.formProperties,
      );
      await component.processPayload(payload, navEvent);
      expect(transactionServiceSpy.update).toHaveBeenCalled();
      expect(navigateToSpy).toHaveBeenCalled();
    });

    it('should set processing to false if no transaction type identifier on payload', () => {
      component.form.addControl('linkedF3xId', new SubscriptionFormControl());
      component.form.get('linkedF3xId')?.setValue('321');

      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        '999',
        component.form,
        component.formProperties,
      );
      expect(payload.report_ids?.length).toEqual(2);
      expect(payload.report_ids?.includes('321')).toBeTrue();
    });
  });

  describe('confirmWithUser', () => {
    it('should throw an error if no template map', async () => {
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        '999',
        component.form,
        component.formProperties,
      );
      payload.transactionType = {} as TransactionType;
      await expectAsync(component.confirmWithUser(payload, component.form)).toBeRejectedWithError(
        'Fecfile: Cannot find template map when confirming transaction',
      );
    });

    it('should return without confirmation if using parent and contact_1', fakeAsync(async () => {
      if (!component.transaction) throw new Error('Bad test');
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        '999',
        component.form,
        component.formProperties,
      );
      expect(Object.keys(component.transaction.transactionType.contactConfig)[0]).toEqual('contact_1');
      payload.transactionType.useParentContact = true;
      component.confirmWithUser(payload, component.form);
      expect(confirmSpy).toHaveBeenCalledTimes(0);
    }));

    it('should generate confirm message if there is no contact id', () => {
      if (!component.transaction) throw new Error('Bad test');
      confirmSpy.and.callFake((confirmation: Confirmation) => {
        if (confirmation.accept) return confirmation?.accept();
      });
      (component.transaction['contact_1' as keyof Transaction] as Contact).id = undefined;
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        '999',
        component.form,
        component.formProperties,
      );

      const confirmMessageSpy = spyOn(TransactionContactUtils, 'getCreateTransactionContactConfirmationMessage');
      component.confirmWithUser(payload, component.form);
      expect(confirmMessageSpy).toHaveBeenCalled();
    });
  });

  it('should automatically route if the navigation event is not a save event', () => {
    const navEvent = new NavigationEvent(NavigationAction.CANCEL);
    component.handleNavigate(navEvent);
    expect(navigateToSpy).toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalledTimes(0);
  });

  describe('save navigation', () => {
    beforeEach(() => {
      navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
    });

    it('should exit if form is invalid', () => {
      component.form.addControl('test', new SubscriptionFormControl(undefined, Validators.required));
      expect(component.form.invalid).toBeTruthy();
      component.handleNavigate(navEvent);
      expect(navigateToSpy).toHaveBeenCalledTimes(0);
    });

    it('should exit if transaction is missing', () => {
      expect(component.form.invalid).toBeFalsy();
      component.transaction = undefined;
      component.handleNavigate(navEvent);
      expect(navigateToSpy).toHaveBeenCalledTimes(0);
    });

    it('should confirm with user before proceeding', async () => {
      confirmSpy.and.callFake((confirmation: Confirmation) => {
        if (confirmation.accept) return confirmation?.accept();
      });
      component.ngOnInit();
      await component.handleNavigate(navEvent);
      expect(confirmSpy).toHaveBeenCalled();
    });

    it('should stop processing if user rejects', async () => {
      component.ngOnInit();
      confirmSpy.and.callFake((confirmation: Confirmation) => {
        if (confirmation.reject) return confirmation?.reject();
      });
      await component.handleNavigate(navEvent);
      expect(transactionServiceSpy.update).toHaveBeenCalledTimes(0);
    });

    it('should save on confirmation', async () => {
      component.ngOnInit();
      if (component.transaction) transactionServiceSpy.update.and.returnValue(Promise.resolve(component.transaction));
      confirmSpy.and.callFake((confirmation: Confirmation) => {
        if (confirmation.accept) return confirmation?.accept();
      });
      expect(component.form.invalid).toBeFalse();
      await component.handleNavigate(navEvent);

      expect(transactionServiceSpy.update).toHaveBeenCalled();
      expect(navigateToSpy).toHaveBeenCalled();
    });
  });

  describe('navigateTo', () => {
    beforeEach(() => {
      navigateToSpy.and.callThrough();
    });

    function testMessage(navEvent: NavigationEvent) {
      component.navigateTo(navEvent);
      expect(messageServiceSpy.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Successful',
        detail: 'Transaction Saved',
        life: 3000,
      });
    }

    function testNoMessage(navEvent: NavigationEvent) {
      component.navigateTo(navEvent);
      expect(messageServiceSpy.add).toHaveBeenCalledTimes(0);
    }

    function testNavigate(navEvent: NavigationEvent, route: string, options?: NavigationBehaviorOptions) {
      component.navigateTo(navEvent);
      if (options) expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(route, options);
      else expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(route);
    }

    // ANOTHER //
    describe('NavigationDestination.ANOTHER', () => {
      it('should send success to message service', () => {
        testMessage(
          new NavigationEvent(
            NavigationAction.SAVE,
            NavigationDestination.ANOTHER,
            getTestTransactionByType(ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT),
            ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
          ),
        );
      });

      it('should route to the same transaction type', () => {
        const transaction = getTestTransactionByType(ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO);
        testNavigate(
          new NavigationEvent(
            NavigationAction.SAVE,
            NavigationDestination.ANOTHER,
            transaction,
            ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO,
          ),
          '/reports/transactions/report/999/create/PARTNERSHIP_JF_TRANSFER_MEMO',
        );
      });
      it('should route to create a sub transaction of the current parent', () => {
        const transaction = getTestTransactionByType(ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO);
        transaction.parent_transaction_id = '1';
        testNavigate(
          new NavigationEvent(
            NavigationAction.SAVE,
            NavigationDestination.ANOTHER,
            transaction,
            ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO,
          ),
          '/reports/transactions/report/999/list/1/create-sub-transaction/PARTNERSHIP_JF_TRANSFER_MEMO',
          { onSameUrlNavigation: 'reload' },
        );
      });
    });

    // CHILD //
    describe('NavigationDestination.CHILD', () => {
      it('should send success to message service', () => {
        testMessage(
          new NavigationEvent(
            NavigationAction.SAVE,
            NavigationDestination.CHILD,
            getTestTransactionByType(ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT),
            ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
          ),
        );
      });
      it('should route to child of current transaction if CHILD', () => {
        const transaction = getTestTransactionByType(ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO);
        transaction.id = '1';
        testNavigate(
          new NavigationEvent(
            NavigationAction.SAVE,
            NavigationDestination.CHILD,
            transaction,
            ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
          ),
          '/reports/transactions/report/999/list/1/create-sub-transaction/PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO',
        );
      });
    });

    // PARENT //
    describe('NavigationDestination.PARENT', () => {
      it('should not send success to message service', () => {
        testNoMessage(
          new NavigationEvent(
            NavigationAction.CANCEL,
            NavigationDestination.PARENT,
            getTestTransactionByType(ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT),
            ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
          ),
        );
      });
      it('should route to the parent if PARENT', () => {
        const transaction = getTestTransactionByType(ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO);
        transaction.parent_transaction_id = '1';
        testNavigate(
          new NavigationEvent(
            NavigationAction.SAVE,
            NavigationDestination.PARENT,
            transaction,
            ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO,
          ),
          '/reports/transactions/report/999/list/1',
        );
      });
    });

    // LIST //
    describe('NavigationDestination.LIST', () => {
      it('should not send success to message service if SAVE', () => {
        testMessage(
          new NavigationEvent(
            NavigationAction.SAVE,
            NavigationDestination.LIST,
            getTestTransactionByType(ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT),
            ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
          ),
        );
      });
      it('should send success to message service if CANCEL', () => {
        testNoMessage(
          new NavigationEvent(
            NavigationAction.CANCEL,
            NavigationDestination.LIST,
            getTestTransactionByType(ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT),
            ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
          ),
        );
      });
    });
  });

  describe('updateFormWithCandidateContact', () => {
    it('should call updateFormWithCandidateContact', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithCandidateContact');
      const selectItem: SelectItem<Contact> = { value: new Contact() };
      component.updateFormWithCandidateContact(selectItem);
      expect(spy).toHaveBeenCalledWith(
        selectItem,
        component.form,
        component.transaction,
        component.contactIdMap['contact_2'],
      );
    });
  });

  describe('updateFormWithSecondaryContact', () => {
    it('should call updateFormWithSecondaryContact', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithSecondaryContact');
      const selectItem: SelectItem<Contact> = { value: new Contact() };
      component.updateFormWithSecondaryContact(selectItem);
      expect(spy).toHaveBeenCalledWith(
        selectItem,
        component.form,
        component.transaction,
        component.contactIdMap['contact_2'],
      );
    });
  });

  describe('updateFormWithTertiaryContact', () => {
    it('should call updateFormWithTertiaryContact', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithTertiaryContact');
      const selectItem: SelectItem<Contact> = { value: new Contact() };
      component.updateFormWithTertiaryContact(selectItem);
      expect(spy).toHaveBeenCalledWith(
        selectItem,
        component.form,
        component.transaction,
        component.contactIdMap['contact_2'],
      );
    });
  });

  describe('getMemoCodeCheckboxLabel$', () => {
    it('should return required label if read only', () => {
      component.ngOnInit();
      if (!component.transactionType) throw new Error('Bad test');
      const spy = spyOn(TransactionFormUtils, 'isMemoCodeReadOnly').and.callFake(() => {
        return true;
      });
      component.getMemoCodeCheckboxLabel$(component.form, component.transactionType).subscribe((res) => {
        expect(res).toEqual('MEMO ITEM');
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should return required label if memo required', () => {
      component.ngOnInit();
      if (!component.transactionType) throw new Error('Bad test');
      const spy = spyOn(TransactionFormUtils, 'isMemoCodeReadOnly').and.callFake(() => {
        return false;
      });
      const memo = component.form.get(component.transactionType.templateMap.memo_code);
      if (!memo) throw new Error('missing memo');
      memo.addValidators([Validators.requiredTrue]);
      let result = '';
      component.getMemoCodeCheckboxLabel$(component.form, component.transactionType).subscribe((res) => (result = res));
      memo.setValue('');
      expect(result).toEqual('MEMO ITEM');
      expect(spy).toHaveBeenCalled();
    });

    it('should return optional label if memo not required', fakeAsync(() => {
      component.ngOnInit();
      if (!component.transactionType) throw new Error('Bad test');
      component.form.get(component.transactionType?.templateMap.memo_code)?.clearValidators();
      const spy = spyOn(TransactionFormUtils, 'isMemoCodeReadOnly').and.returnValue(false);
      component.getMemoCodeCheckboxLabel$(component.form, component.transactionType).subscribe((res) => {
        expect(res).toEqual('MEMO ITEM (OPTIONAL)');
      });
      tick(500);
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('initInheritedFieldsFromParent', () => {
    it('should throw an error when no transaction', () => {
      component.transaction = undefined;
      expect(function () {
        component.initInheritedFieldsFromParent();
      }).toThrow(new Error('Fecfile: No transaction found in initIneheritedFieldsFromParent'));
    });
  });

  describe('confirmation$', () => {
    it('should return false if no transaction', async () => {
      component.transaction = undefined;
      const res = await component.confirmation$;
      expect(res).toBeFalse();
    });

    it('should call confirm with user', async () => {
      confirmSpy.and.callFake((confirmation: Confirmation) => {
        if (confirmation.accept) return confirmation?.accept();
      });
      component.ngOnInit();
      const res = await component.confirmation$;
      expect(res).toBeTruthy();
      expect(confirmSpy).toHaveBeenCalled();
    });
  });
});
