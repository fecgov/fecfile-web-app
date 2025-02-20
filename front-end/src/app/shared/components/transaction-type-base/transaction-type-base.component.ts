import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { ConfirmationService, MessageService, SelectItem, ToastMessageOptions } from 'primeng/api';
import { map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { ContactIdMapType, TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { Report, ReportTypes } from 'app/shared/models/report.model';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { selectNavigationEvent } from 'app/store/navigation-event.selectors';
import { navigationEventClearAction } from 'app/store/navigation-event.actions';

@Component({
  template: '',
})
export abstract class TransactionTypeBaseComponent implements OnInit, OnDestroy {
  protected readonly messageService = inject(MessageService);
  readonly transactionService = inject(TransactionService);
  protected readonly contactService = inject(ContactService);
  protected confirmationService = inject(ConfirmationService);
  protected readonly fb = inject(FormBuilder);
  protected readonly router = inject(Router);
  protected readonly fecDatePipe = inject(FecDatePipe);
  protected readonly store = inject(Store);
  protected readonly reportService = inject(ReportService);
  protected readonly activatedRoute = inject(ActivatedRoute);

  @Input() transaction: Transaction | undefined;
  formProperties: string[] = [];
  transactionType?: TransactionType;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  readonly destroy$: Subject<boolean> = new Subject<boolean>();
  readonly activeReport$: Observable<Report> = this.store.select(selectActiveReport).pipe(takeUntil(this.destroy$));
  readonly activeReportId: string = this.activatedRoute.snapshot.params['reportId'] ?? '';
  readonly navigationEvent$: Observable<NavigationEvent> = this.store
    .select(selectNavigationEvent)
    .pipe(takeUntil(this.destroy$));
  readonly reportTypes = ReportTypes;
  readonly saveSuccessMessage: ToastMessageOptions = {
    severity: 'success',
    summary: 'Successful',
    detail: 'Transaction Saved',
    life: 3000,
  };

  contactIdMap: ContactIdMapType = {};
  formSubmitted = false;
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  form: FormGroup = this.fb.group({}, { updateOn: 'blur' });
  isEditable = true;
  memoCodeCheckboxLabel$ = of('');
  committeeAccount?: CommitteeAccount;

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

    this.form = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties), { updateOn: 'blur' });

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
    if (this.transaction?.transactionType?.getInheritedFields(this.transaction)) {
      this.initInheritedFieldsFromParent();
    }

    this.activeReport$.subscribe((report) => {
      this.isEditable =
        this.reportService.isEditable(report) && !ReattRedesUtils.isCopyFromPreviousReport(this.transaction);
      if (!this.isEditable) this.form.disable();
    });

    this.store.dispatch(navigationEventClearAction());
    this.navigationEvent$.subscribe((navEvent) => {
      if (navEvent) {
        const navigationEvent = { ...navEvent };
        this.handleNavigate(navigationEvent);
        this.store.dispatch(navigationEventClearAction());
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    Object.values(this.contactIdMap).forEach((id$) => id$.complete());
  }

  writeToApi(payload: Transaction): Promise<Transaction> {
    if (payload.id) {
      return this.transactionService.update(payload);
    } else {
      return this.transactionService.create(payload);
    }
  }

  async save(navigationEvent: NavigationEvent): Promise<void> {
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
    await this.processPayload(payload, navigationEvent);
  }

  async processPayload(payload: Transaction, navigationEvent: NavigationEvent): Promise<void> {
    if (payload.transaction_type_identifier) {
      const transaction = await this.writeToApi(payload);

      navigationEvent.transaction = transaction;
      await this.navigateTo(navigationEvent);
    } else {
      this.store.dispatch(singleClickEnableAction());
    }
  }

  async confirmWithUser(
    transaction: Transaction,
    form: FormGroup,
    targetDialog: 'dialog' | 'childDialog' | 'childDialog_2' = 'dialog',
  ): Promise<boolean> {
    const templateMap = transaction.transactionType.templateMap;
    if (!templateMap) {
      throw new Error('Fecfile: Cannot find template map when confirming transaction');
    }

    const confirmations = Object.entries(transaction.transactionType?.contactConfig ?? {}).map(
      async ([contactKey, config]: [string, { [formField: string]: string }]) => {
        if (transaction[contactKey as keyof Transaction]) {
          if (transaction.transactionType?.getUseParentContact(transaction) && contactKey === 'contact_1') {
            return true;
          }

          const contact = transaction[contactKey as keyof Transaction] as Contact;
          if (!contact.id) {
            const message = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
              contact.type,
              form,
              templateMap,
              contactKey,
            );
            return TransactionContactUtils.displayConfirmationPopup(message, this.confirmationService, targetDialog);
          }

          const changes = TransactionContactUtils.getContactChanges(form, contact, templateMap, config, transaction);
          if (changes.length > 0) {
            const message = TransactionContactUtils.getContactChangesMessage(contact, changes);
            return TransactionContactUtils.displayConfirmationPopup(message, this.confirmationService, targetDialog);
          }
        }
        return true; // If no confirmation is needed, return `true`
      },
    );

    // Await all confirmations
    const results = await Promise.all(confirmations);

    // Reduce to a single boolean value (similar to RxJS `reduce()`)
    return results.every((confirmed) => confirmed);
  }

  isInvalid(): boolean {
    blurActiveInput(this.form);
    return this.form.invalid || !this.transaction;
  }

  get confirmation$(): Promise<boolean> {
    if (!this.transaction) return Promise.resolve(false);
    return this.confirmWithUser(this.transaction, this.form);
  }

  async handleNavigate(navigationEvent: NavigationEvent): Promise<void> {
    this.formSubmitted = true;

    if (navigationEvent.action === NavigationAction.SAVE) {
      if (this.isInvalid()) {
        this.store.dispatch(singleClickEnableAction());
        return;
      }
      const confirmed = await this.confirmation$;
      // if every confirmation was accepted
      if (confirmed) await this.save(navigationEvent);
      else this.store.dispatch(singleClickEnableAction());
    } else {
      await this.navigateTo(navigationEvent);
    }
  }

  async navigateTo(event: NavigationEvent): Promise<boolean> {
    /**
     * Interpret event to navigate to correct destination.
     *  - If the destination is ANOTHER, navigate to create another transaction of the same type
     *      (a child of the current transaction's parent if it exists)
     *  - If the destination is CHILD, navigate to create a sub-transaction of the current transaction
     */
    let result = false;
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    const reportPath = `/reports/transactions/report/${reportId}`;
    // If the transaction is saved, display a success message
    if (event.action === NavigationAction.SAVE) {
      this.messageService.add(this.saveSuccessMessage);
    }
    if (event.destination === NavigationDestination.ANOTHER) {
      // If the transaction has a parent, navigate to create another sub-transaction of it
      if (event.transaction?.parent_transaction_id) {
        result = await this.router.navigateByUrl(
          `${reportPath}/list/${event.transaction?.parent_transaction_id}/create-sub-transaction/${event.destinationTransactionType}`,
          { onSameUrlNavigation: 'reload' },
        );
        // Otherwise, navigate to create another tier 1 transaction
      } else {
        result = await this.router.navigateByUrl(`${reportPath}/create/${event.destinationTransactionType}`);
      }
    } else if (event.destination === NavigationDestination.CHILD) {
      // Navigate to create a sub-transaction of the current transaction
      result = await this.router.navigateByUrl(
        `${reportPath}/list/${event.transaction?.id}/create-sub-transaction/${event.destinationTransactionType}`,
      );
    } else if (event.destination === NavigationDestination.PARENT) {
      result = await this.router.navigateByUrl(`${reportPath}/list/${event.transaction?.parent_transaction_id}`);
    } else {
      result = await this.router.navigateByUrl(`${reportPath}/list`);
    }
    this.resetForm();
    return result;
  }

  resetForm() {
    this.formSubmitted = false;
    this.form = TransactionFormUtils.resetForm(
      this.form,
      this.transaction,
      this.contactTypeOptions,
      this.committeeAccount,
    );
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
