import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { ConfirmationService, MessageService, SelectItem, Message } from 'primeng/api';
import { concatAll, from, map, Observable, of, reduce, startWith, Subject, takeUntil } from 'rxjs';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { ContactIdMapType, TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { Report, ReportTypes } from 'app/shared/models/report.model';
import { blurActiveInput } from 'app/shared/utils/form.utils';

@Component({
  template: '',
})
export abstract class TransactionTypeBaseComponent implements OnInit, OnDestroy, OnChanges {
  @Input() transaction: Transaction | undefined;
  @Input() navigationEvent?: NavigationEvent;
  formProperties: string[] = [];
  transactionType?: TransactionType;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  destroy$: Subject<boolean> = new Subject<boolean>();
  contactIdMap: ContactIdMapType = {};
  formSubmitted = false;
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  form: FormGroup = this.fb.group({}, { updateOn: 'blur' });
  isEditable = true;
  memoCodeCheckboxLabel$ = of('');
  committeeAccount?: CommitteeAccount;
  activeReport$: Observable<Report>;
  activeReportId: string;
  reportTypes = ReportTypes;

  saveSuccessMessage: Message = {
    severity: 'success',
    summary: 'Successful',
    detail: 'Transaction Saved',
    life: 3000,
  };

  constructor(
    protected messageService: MessageService,
    public transactionService: TransactionService,
    protected contactService: ContactService,
    protected confirmationService: ConfirmationService,
    protected fb: FormBuilder,
    protected router: Router,
    protected fecDatePipe: FecDatePipe,
    protected store: Store,
    protected reportService: ReportService,
    protected activatedRoute: ActivatedRoute,
  ) {
    this.activeReport$ = this.store.select(selectActiveReport).pipe(takeUntil(this.destroy$));
    this.activeReportId = this.activatedRoute.snapshot.params['reportId'] ?? '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['navigationEvent'] && this.navigationEvent) {
      this.handleNavigate(this.navigationEvent);
    }
  }

  ngOnInit(): void {
    if (!this.transaction?.transactionType?.templateMap) {
      throw new Error('Fecfile: Template map not found for transaction component');
    }
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        this.committeeAccount = committeeAccount;
      });
    this.transactionType = this.transaction.transactionType;
    this.templateMap = this.transactionType.templateMap;
    this.formProperties = this.transactionType.getFormControlNames();
    this.contactTypeOptions = getContactTypeOptions(this.transactionType.contactTypeOptions ?? []);

    this.form = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties, this.fb), { updateOn: 'blur' });

    this.memoCodeCheckboxLabel$ = this.getMemoCodeCheckboxLabel$(this.form, this.transactionType);

    TransactionFormUtils.onInit(this, this.form, this.transaction, this.contactIdMap, this.contactService);

    // Determine if amount should always be negative and then force it to be so if needed
    if (this.transactionType?.negativeAmountValueOnly && this.templateMap?.amount) {
      this.form
        .get(this.templateMap.amount)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((amount) => {
          if (+amount > 0) {
            this.form.patchValue({ [this.templateMap.amount]: -1 * amount });
          }
        });
    }

    // If this single-entry transaction has inherited fields from its parent, load values
    // from parent on create and set field to read-only. For edit, just make
    // the fields read-only
    if (this.transaction.transactionType.getInheritedFields(this.transaction)) {
      this.initInheritedFieldsFromParent();
    }

    this.activeReport$.subscribe((report) => {
      this.isEditable =
        this.reportService.isEditable(report) && !ReattRedesUtils.isCopyFromPreviousReport(this.transaction);
      if (!this.isEditable) this.form.disable();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    Object.values(this.contactIdMap).forEach((id$) => id$.complete());
  }

  writeToApi(payload: Transaction): Observable<Transaction> {
    if (payload.id) {
      return this.transactionService.update(payload);
    } else {
      return this.transactionService.create(payload);
    }
  }

  save(navigationEvent: NavigationEvent) {
    // update all contacts with changes from form.
    if (this.transaction) {
      TransactionContactUtils.updateContactsWithForm(this.transaction, this.templateMap, this.form);
    } else {
      this.store.dispatch(singleClickEnableAction());
      throw new Error('Fecfile: No transactions submitted for single-entry transaction form.');
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.activeReportId,
      this.form,
      this.formProperties,
    );
    this.processPayload(payload, navigationEvent);
  }

  processPayload(payload: Transaction, navigationEvent: NavigationEvent) {
    if (payload.transaction_type_identifier) {
      this.writeToApi(payload).subscribe((transaction) => {
        navigationEvent.transaction = transaction;
        this.navigateTo(navigationEvent);
      });
    } else {
      this.store.dispatch(singleClickEnableAction());
    }
  }

  confirmWithUser(
    transaction: Transaction,
    form: FormGroup,
    targetDialog: 'dialog' | 'childDialog' | 'childDialog_2' = 'dialog',
  ) {
    const templateMap = transaction.transactionType.templateMap;
    if (!templateMap) {
      throw new Error('Fecfile: Cannot find template map when confirming transaction');
    }
    const confirmations$ = Object.entries(transaction.transactionType?.contactConfig ?? {})
      .map(([contactKey, config]: [string, { [formField: string]: string }]) => {
        if (transaction[contactKey as keyof Transaction]) {
          if (transaction.transactionType?.getUseParentContact(transaction) && contactKey === 'contact_1') {
            return '';
          }
          const contact = transaction[contactKey as keyof Transaction] as Contact;
          if (!contact.id) {
            return TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
              contact.type,
              form,
              templateMap,
              contactKey,
            );
          }
          const changes = TransactionContactUtils.getContactChanges(form, contact, templateMap, config);
          if (changes.length > 0) {
            return TransactionContactUtils.getContactChangesMessage(contact, changes);
          }
        }
        return '';
      })
      .filter((message) => !!message)
      .map((message: string) => {
        return TransactionContactUtils.displayConfirmationPopup(message, this.confirmationService, targetDialog);
      });

    return from([of(true), ...confirmations$]).pipe(
      concatAll(),
      reduce((accumulator, confirmed) => accumulator && confirmed),
    );
  }

  isInvalid(): boolean {
    blurActiveInput(this.form);
    return this.form.invalid || !this.transaction;
  }

  get confirmation$(): Observable<boolean> {
    if (!this.transaction) return of(false);
    return this.confirmWithUser(this.transaction, this.form);
  }

  handleNavigate(navigationEvent: NavigationEvent): void {
    this.formSubmitted = true;

    if (navigationEvent.action === NavigationAction.SAVE) {
      if (this.isInvalid()) {
        this.store.dispatch(singleClickEnableAction());
        return;
      }
      this.confirmation$.subscribe((confirmed: boolean) => {
        // if every confirmation was accepted
        if (confirmed) this.save(navigationEvent);
        else this.store.dispatch(singleClickEnableAction());
      });
    } else {
      this.navigateTo(navigationEvent);
    }
  }

  navigateTo(event: NavigationEvent) {
    /**
     * Interpret event to navigate to correct destination.
     *  - If the destination is ANOTHER, navigate to create another transaction of the same type
     *      (a child of the current transaction's parent if it exists)
     *  - If the destination is CHILD, navigate to create a sub-transaction of the current transaction
     */
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    const reportPath = `/reports/transactions/report/${reportId}`;
    // If the transaction is saved, display a success message
    if (event.action === NavigationAction.SAVE) {
      this.messageService.add(this.saveSuccessMessage);
    }
    if (event.destination === NavigationDestination.ANOTHER) {
      // If the transaction has a parent, navigate to create another sub-transaction of it
      if (event.transaction?.parent_transaction_id) {
        this.router.navigateByUrl(
          `${reportPath}/list/${event.transaction?.parent_transaction_id}/create-sub-transaction/${event.destinationTransactionType}`,
        );
        // Otherwise, navigate to create another tier 1 transaction
      } else {
        this.router.navigateByUrl(`${reportPath}/create/${event.destinationTransactionType}`);
      }
    } else if (event.destination === NavigationDestination.CHILD) {
      // Navigate to create a sub-transaction of the current transaction
      this.router.navigateByUrl(
        `${reportPath}/list/${event.transaction?.id}/create-sub-transaction/${event.destinationTransactionType}`,
      );
    } else if (event.destination === NavigationDestination.PARENT) {
      this.router.navigateByUrl(`${reportPath}/list/${event.transaction?.parent_transaction_id}`);
    } else {
      this.router.navigateByUrl(`${reportPath}/list`);
    }
  }

  resetForm() {
    this.formSubmitted = false;
    TransactionFormUtils.resetForm(this.form, this.transaction, this.contactTypeOptions, this.committeeAccount);
  }

  updateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithPrimaryContact(
      selectItem,
      this.form,
      this.transaction,
      this.contactIdMap['contact_1'],
    );
  }

  updateFormWithCandidateContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithCandidateContact(
      selectItem,
      this.form,
      this.transaction,
      this.contactIdMap['contact_2'],
    );
  }

  updateFormWithSecondaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithSecondaryContact(
      selectItem,
      this.form,
      this.transaction,
      this.contactIdMap['contact_2'],
    );
  }

  updateFormWithTertiaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithTertiaryContact(
      selectItem,
      this.form,
      this.transaction,
      this.contactIdMap['contact_3'],
    );
  }

  getMemoCodeCheckboxLabel$(form: FormGroup, transactionType: TransactionType) {
    const requiredLabel = 'MEMO ITEM';
    const optionalLabel = requiredLabel + ' (OPTIONAL)';

    const memoControl = form.get(transactionType?.templateMap.memo_code);

    if (TransactionFormUtils.isMemoCodeReadOnly(transactionType) || !memoControl) {
      return of(requiredLabel);
    }
    return memoControl.valueChanges.pipe(
      map(() => {
        return memoControl.hasValidator(Validators.requiredTrue) ? requiredLabel : optionalLabel;
      }),
      startWith(optionalLabel),
      takeUntil(this.destroy$),
    );
  }

  /**
   * If the transaction being created/edited has inheritedFields, populate the form values
   * from the parent_transaction (or debt or loan) on create. On edit, simply make the fields read-only.
   *
   * The entity_type is handled as a special case because it does not exist in the templateMap.
   */
  initInheritedFieldsFromParent(): void {
    if (!this.transaction) throw new Error('Fecfile: No transaction found in initIneheritedFieldsFromParent');

    // If creating a new transaction, set both form and contact_1 values from parent transaction
    if (!this.transaction.id) {
      const ancestor = this.transaction.parent_transaction ?? this.transaction.debt ?? this.transaction.loan;
      this.transaction.contact_1 = ancestor?.contact_1;
      this.transaction.contact_1_id = ancestor?.contact_1_id;

      const entityTypeValue = ancestor?.contact_1?.type;
      if (entityTypeValue) this.form.get('entity_type')?.setValue(entityTypeValue);
      this.form.get('entity_type')?.updateValueAndValidity();

      this.transaction.transactionType.getInheritedFields(this.transaction)?.forEach((inherittedField) => {
        if (ancestor && this.transaction) {
          const fieldControl = this.form.get(this.transaction.transactionType.templateMap[inherittedField]);
          const value = ancestor[`${ancestor?.transactionType.templateMap[inherittedField]}` as keyof Transaction];
          if (value !== undefined) {
            fieldControl?.setValue(value);
            fieldControl?.updateValueAndValidity();
          }
        }
      });
    }

    // Set fields to read-only
    this.form.get('entity_type')?.disable();
    this.transaction.transactionType.getInheritedFields(this.transaction)?.forEach((inherittedField) => {
      if (this.transaction) {
        const fieldControl = this.form.get(this.transaction.transactionType.templateMap[inherittedField]);
        fieldControl?.disable();
      }
    });
  }
}
