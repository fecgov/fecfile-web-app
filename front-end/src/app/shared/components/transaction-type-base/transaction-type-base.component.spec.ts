import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
import { Contact, ContactTypes } from "../../models/contact.model";
import { TransactionContactUtils } from "./transaction-contact.utils";
import { TransactionFormUtils } from "./transaction-form.utils";
import { TransactionType } from "../../models/transaction-type.model";
import { ActivatedRoute, Router } from "@angular/router";
import { Transaction } from "../../models/transaction.model";

let testTransaction: SchATransaction;

describe('TransactionTypeBaseComponent', () => {
  let component: TransactionTypeBaseComponent;
  let fixture: ComponentFixture<TransactionTypeBaseComponent>;
  let testConfirmationService: ConfirmationService;

  //spys
  let navigateToSpy: jasmine.Spy;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;
  let confirmSpy: jasmine.Spy;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  let navEvent: NavigationEvent;
  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  }
  const mockActivatedRoute = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDetailComponent],
      imports: [HttpClientTestingModule],
      providers: [
        DatePipe,
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj('MessageService', {
            add: (message: { severity: string, summary: string, detail: string, life: number }) => {
              console.log(message.summary);
            },
          })
        },
        FormBuilder,
        {
          provide: TransactionService,
          useValue: jasmine.createSpyObj('TransactionService', {
            update: of(undefined),
            create: of(undefined),
            getPreviousTransactionForAggregate: of(undefined),
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
    fixture.detectChanges();

    navigateToSpy = spyOn(component, 'navigateTo');
    confirmSpy = spyOn(testConfirmationService, 'confirm');
  });

  describe('init', () => {
    it('should initialize Individual Receipt', () => {
      expect(component).toBeTruthy();
      expect(component.transactionType?.title).toBe('Individual Receipt');
    });

    it('should throw an error if the transaction template map is unavailable', () => {
      component.transaction = undefined;
      expect(function () {
        component.ngOnInit();
      }).toThrow(new Error('Fecfile: Template map not found for transaction component'));
    })

    it('should set the contact type options', () => {
      expect(component.contactTypeOptions).toContain({value: ContactTypes.INDIVIDUAL, label: 'Individual'});
      expect(component.contactTypeOptions.length).toEqual(1);
    })
  });

  it('positive contribution_amount values should be overridden when the schema requires a negative value', () => {
    component.transaction = getTestTransactionByType(ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
    component.ngOnInit();

    component.form.patchValue({contribution_amount: 2});
    expect(component.form.get('contribution_amount')?.value).toBe(-2);
  });

  it('inherited fields should use the parent transaction to initialize the form values', () => {
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
    })
    it('should update contacts form if there is a transaction', () => {
      const contactSpy = spyOn(TransactionContactUtils, 'updateContactsWithForm')
      component.save(navEvent);
      expect(contactSpy).toHaveBeenCalled();
    });
    it('should stop processing and throw an error if there is no transaction', () => {
      component.transaction = undefined;
      expect(function () {
        component.save(navEvent);
      }).toThrow(new Error('Fecfile: No transactions submitted for single-entry transaction form.'));
    });
  });

  describe('processPayload', () => {
    beforeEach(() => {
      navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
    })
    it('should set processing to false if no transaction type identifier on payload', () => {
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        component.form,
        component.formProperties
      );
      payload.transaction_type_identifier = undefined;
      component.processPayload(payload, navEvent);
    });

    it('should update data and then set processing to false', () => {
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        component.form,
        component.formProperties
      );
      component.processPayload(payload, navEvent);
      expect(transactionServiceSpy.update).toHaveBeenCalled();
      expect(navigateToSpy).toHaveBeenCalled();
    })
  });

  describe('confirmWithUser', () => {
    it('should throw an error if no template map', () => {
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        component.form,
        component.formProperties
      );
      payload.transactionType = {} as TransactionType;
      expect(function () {
        component.confirmWithUser(payload, component.form);
      }).toThrow(new Error('Fecfile: Cannot find template map when confirming transaction'));
    });

    it('should return without confirmation if using parent and contact_1', () => {
      if (!component.transaction) throw new Error("Bad test");
      component.transaction.transactionType.useParentContact = true;
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        component.form,
        component.formProperties
      );
      expect(Object.keys(component.transaction.transactionType.contactConfig)[0]).toEqual("contact_1");
      component.confirmWithUser(payload, component.form);
      expect(confirmSpy).toHaveBeenCalledTimes(0);
    });

    it('should generate confirm message if there is no contact id', () => {
      if (!component.transaction) throw new Error("Bad test");
      confirmSpy.and.callFake((confirmation: Confirmation) => {
        if (confirmation.accept) return confirmation?.accept();
      });
      (component.transaction['contact_1' as keyof Transaction] as Contact).id = undefined;
      const payload = TransactionFormUtils.getPayloadTransaction(
        component.transaction,
        component.form,
        component.formProperties
      );

      const confirmMessageSpy = spyOn(TransactionContactUtils, 'getCreateTransactionContactConfirmationMessage')
      component.confirmWithUser(payload, component.form);
      expect(confirmMessageSpy).toHaveBeenCalled();
    });
  });

  describe('handleNavigation', () => {
    it('should automatically route if the navigation event is not a save event', () => {
      const navEvent = new NavigationEvent(NavigationAction.CANCEL);
      component.handleNavigate(navEvent)
      expect(navigateToSpy).toHaveBeenCalled();
      expect(confirmSpy).toHaveBeenCalledTimes(0);
    });

    describe('save navigation', () => {
      beforeEach(() => {
        navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
      });

      it('should exit if form is invalid', () => {
        component.form.addControl('test', new FormControl(undefined, Validators.required));
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

      it('should confirm with user before proceeding', () => {
        component.handleNavigate(navEvent);
        expect(confirmSpy).toHaveBeenCalled();
      });

      it('should stop processing if user rejects', fakeAsync(() => {
        confirmSpy.and.callFake((confirmation: Confirmation) => {
          if (confirmation.reject) return confirmation?.reject();
        });
        component.handleNavigate(navEvent);
        tick(500);
      }));

      it('should save on confirmation', fakeAsync(() => {
        if (component.transaction) transactionServiceSpy.update.and.returnValue(of(component.transaction));
        confirmSpy.and.callFake((confirmation: Confirmation) => {
          if (confirmation.accept) return confirmation?.accept();
        });
        expect(component.form.invalid).toBeFalse();
        component.handleNavigate(navEvent);
        tick(500);
        expect(transactionServiceSpy.update).toHaveBeenCalled();
        expect(navigateToSpy).toHaveBeenCalled();
      }));
    });
  });

  describe('navigateTo', () => {
    beforeEach(() => {
      navigateToSpy.and.callThrough();
    })
    describe('NavigationDestination.ANOTHER or NavigationDestination.ANOTHER_CHILD', () => {
      it('should send success to message service', () => {
        testMessage(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.ANOTHER, component.transaction, ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT));
        testMessage(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.ANOTHER_CHILD, component.transaction, ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT));
      });

      it('should route based on whether it is has a parent_transaction_id', () => {
        testParent(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.ANOTHER, component.transaction, ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT));
        testParent(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.ANOTHER_CHILD, component.transaction, ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT));
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

      function testParent(navEvent: NavigationEvent) {
        component.navigateTo(navEvent);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reports/transactions/report/999/create/BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT')
        if (navEvent.transaction) navEvent.transaction.parent_transaction_id = "1";
        component.navigateTo(navEvent);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reports/transactions/report/999/list/1/create-sub-transaction/BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT')
      }
    });


    describe('NavigationDestination.CHILD', () => {
      beforeEach(() => {
        navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.CHILD, component.transaction, ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT);
      });
      it('should send success to message service', () => {
        component.navigateTo(navEvent);
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
          severity: 'success',
          summary: 'Successful',
          detail: 'Parent Transaction Saved',
          life: 3000,
        });
      });

      it('should route properly', () => {
        if (navEvent.transaction) navEvent.transaction.parent_transaction_id = "123";
        component.navigateTo(navEvent);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reports/transactions/report/999/list/123/create-sub-transaction/BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT')
      });
    });

    describe('NavigationDestination.', () => {
      beforeEach(() => {
        navEvent = new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, component.transaction);
      });
      it('should route properly', () => {
        component.navigateTo(navEvent);
        expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reports/transactions/report/999/list')
      });
    });
  });

  describe('NavigationDestination', () => {
    it('should call updateFormWithCandidateContact', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithCandidateContact');
      const selectItem: SelectItem<Contact> = {value: new Contact()};
      component.updateFormWithCandidateContact(selectItem);
      expect(spy).toHaveBeenCalledWith(selectItem, component.form, component.transaction, component.contactIdMap['contact_2']);
    });
  });

  describe('updateFormWithSecondaryContact', () => {
    it('should call updateFormWithSecondaryContact', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithSecondaryContact');
      const selectItem: SelectItem<Contact> = {value: new Contact()};
      component.updateFormWithSecondaryContact(selectItem);
      expect(spy).toHaveBeenCalledWith(selectItem, component.form, component.transaction, component.contactIdMap['contact_2']);
    });
  });

  describe('updateFormWithTertiaryContact', () => {
    it('should call updateFormWithTertiaryContact', () => {
      const spy = spyOn(TransactionContactUtils, 'updateFormWithTertiaryContact');
      const selectItem: SelectItem<Contact> = {value: new Contact()};
      component.updateFormWithTertiaryContact(selectItem);
      expect(spy).toHaveBeenCalledWith(selectItem, component.form, component.transaction, component.contactIdMap['contact_2']);
    });
  });

  describe('getMemoCodeCheckboxLabel$', () => {
    it('should return required label if read only', async () => {
      if (!component.transactionType) throw new Error("Bad test");
      const spy = spyOn(TransactionFormUtils, 'isMemoCodeReadOnly').and.callFake(() => {
        return true;
      })
      component.getMemoCodeCheckboxLabel$(component.form, component.transactionType).subscribe(res => {
        expect(res).toEqual('MEMO ITEM');
      })
      expect(spy).toHaveBeenCalled();
    });

    it('should return required label if memo required', async () => {
      if (!component.transactionType) throw new Error("Bad test");
      const spy = spyOn(TransactionFormUtils, 'isMemoCodeReadOnly').and.callFake(() => {
        return false;
      })
      const memo = component.form.get(component.transactionType.templateMap.memo_code);
      if (!memo) throw new Error("missing memo");
      memo.addValidators([Validators.requiredTrue]);
      let result = "";
      component.getMemoCodeCheckboxLabel$(component.form, component.transactionType).subscribe(res => result = res)
      memo.setValue("");
      expect(result).toEqual("MEMO ITEM");
      expect(spy).toHaveBeenCalled();
    });

    it('should return optional label if memo not required', async () => {
      if (!component.transactionType) throw new Error("Bad test");
      const spy = spyOn(TransactionFormUtils, 'isMemoCodeReadOnly').and.callFake(() => {
        return false;
      })
      component.getMemoCodeCheckboxLabel$(component.form, component.transactionType).subscribe(res => {
        expect(res).toEqual('MEMO ITEM (OPTIONAL)');
      })
      expect(spy).toHaveBeenCalled();
    });
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
    it('should return false if no transaction', () => {
      component.transaction = undefined;
      component.confirmation$.subscribe(res => {
        expect(res).toBeFalse();
      })
    });

    it('should call confirm with user', fakeAsync(() => {
      component.confirmation$.subscribe(res => {
        expect(res).toBeTruthy()
      })
      tick(500);
      expect(confirmSpy).toHaveBeenCalled();
    }));
  });
});
