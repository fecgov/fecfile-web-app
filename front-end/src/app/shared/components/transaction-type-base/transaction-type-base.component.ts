import { Component, computed, effect, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from 'app/shared/models/transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { MessageService, SelectItem, ToastMessageOptions } from 'primeng/api';
import { map, Observable, of, startWith, takeUntil } from 'rxjs';
import { ContactIdMapType, TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { selectNavigationEvent } from 'app/store/navigation-event.selectors';
import { navigationEventClearAction } from 'app/store/navigation-event.actions';
import { FormComponent } from '../app-destroyer.component';
import {
  TransactionType,
  ContactTypeLabels,
  ReportTypes,
  TransactionTemplateMapType,
  Contact,
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { ConfirmationWrapperService } from 'app/shared/services/confirmation-wrapper.service';

@Component({
  template: '',
})
export abstract class TransactionTypeBaseComponent extends FormComponent implements OnInit, OnDestroy {
  protected readonly messageService = inject(MessageService);
  readonly transactionService = inject(TransactionService);
  protected readonly contactService = inject(ContactService);
  readonly confirmationService = inject(ConfirmationWrapperService);
  protected readonly router = inject(Router);
  protected readonly fecDatePipe = inject(FecDatePipe);
  protected readonly reportService = inject(ReportService);
  protected readonly activatedRoute = inject(ActivatedRoute);

  protected readonly navigationEventSignal = this.store.selectSignal(selectNavigationEvent);

  @Input() transaction: Transaction | undefined;
  formProperties: string[] = [];
  transactionType?: TransactionType;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);

  readonly activeReportId: string = this.activatedRoute.snapshot.params['reportId'] ?? '';

  readonly reportTypes = ReportTypes;
  readonly saveSuccessMessage: ToastMessageOptions = {
    severity: 'success',
    summary: 'Successful',
    detail: 'Transaction Saved',
    life: 3000,
  };

  contactIdMap: ContactIdMapType = {};
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  form: FormGroup = this.fb.group({}, { updateOn: 'blur' });
  isEditable = computed(
    () =>
      this.reportService.isEditable(this.activeReportSignal()) &&
      !ReattRedesUtils.isCopyFromPreviousReport(this.transaction),
  );
  memoHasOptional$ = of(false);

  constructor() {
    super();
    effect(() => {
      if (!this.isEditable()) this.form.disable();
    });

    effect(() => {
      const navEvent = this.navigationEventSignal();
      if (navEvent) {
        const navigationEvent = { ...navEvent };
        this.handleNavigate(navigationEvent);
        this.store.dispatch(navigationEventClearAction());
      }
    });
  }

  ngOnInit(): void {
    if (!this.transaction?.transactionType?.templateMap) {
      throw new Error('FECfile+: Template map not found for transaction component');
    }

    this.transactionType = this.transaction.transactionType;
    this.templateMap = this.transactionType.templateMap;
    this.formProperties = this.transactionType.getFormControlNames();
    this.contactTypeOptions = getContactTypeOptions(this.transactionType.contactTypeOptions ?? []);

    this.form = this.fb.group(
      SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties, this.transaction.transactionType.schema),
      { updateOn: 'blur' },
    );

    this.memoHasOptional$ = this.getMemoHasOptional$(this.form, this.transactionType);

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

    this.store.dispatch(navigationEventClearAction());
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
      throw new Error('FECfile+: No transactions submitted for single-entry transaction form.');
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

  isInvalid(): boolean {
    blurActiveInput(this.form);
    return this.form.invalid || !this.transaction;
  }

  async getConfirmations(): Promise<boolean> {
    if (!this.transaction) return false;
    return this.confirmationService.confirmWithUser(
      this.form,
      this.transaction.transactionType?.contactConfig ?? {},
      this.getContact.bind(this),
      this.getTemplateMap.bind(this),
      'dialog',
      this.transaction,
    );
  }

  getContact(contactKey: string, transaction?: Transaction) {
    if (!transaction) return null;
    if (transaction[contactKey as keyof Transaction]) {
      if (transaction.transactionType?.getUseParentContact(transaction) && contactKey === 'contact_1') {
        return null;
      }

      return transaction[contactKey as keyof Transaction] as Contact;
    }
    return null;
  }

  getTemplateMap(contactKey: string, transaction?: Transaction): TransactionTemplateMapType | undefined {
    return transaction?.transactionType?.templateMap;
  }

  async handleNavigate(navigationEvent: NavigationEvent): Promise<void> {
    this.formSubmitted = true;

    if (navigationEvent.action === NavigationAction.SAVE) {
      if (this.isInvalid()) {
        this.store.dispatch(singleClickEnableAction());
        return;
      }
      const confirmed = await this.getConfirmations();
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
      this.committeeAccountSignal(),
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

  updateFormWithQuaternaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithQuaternaryContact(
      selectItem,
      this.form,
      this.transaction,
      this.contactIdMap['contact_4'],
    );
  }

  clearFormQuaternaryContact() {
    TransactionContactUtils.clearFormQuaternaryContact(this.form, this.transaction, this.contactIdMap['contact_4']);
  }

  updateFormWithQuinaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithQuinaryContact(
      selectItem,
      this.form,
      this.transaction,
      this.contactIdMap['contact_5'],
    );
  }

  clearFormQuinaryContact() {
    TransactionContactUtils.clearFormQuinaryContact(this.form, this.transaction, this.contactIdMap['contact_5']);
  }

  getMemoHasOptional$(form: FormGroup, transactionType: TransactionType): Observable<boolean> {
    const memoControl = form.get(transactionType?.templateMap.memo_code);
    if (TransactionFormUtils.isMemoCodeReadOnly(transactionType) || !memoControl) {
      return of(true);
    }
    return memoControl.valueChanges.pipe(
      map(() => !memoControl.hasValidator(Validators.requiredTrue)),
      startWith(true),
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
    if (!this.transaction) throw new Error('FECfile+: No transaction found in initIneheritedFieldsFromParent');

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
