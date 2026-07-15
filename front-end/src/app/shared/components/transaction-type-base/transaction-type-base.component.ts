import { Component, computed, effect, inject, model, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from 'app/shared/models/transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { MessageService, SelectItem, ToastMessageOptions } from 'primeng/api';
import { map, Observable, of, startWith, takeUntil } from 'rxjs';
import { ContactIdMapType, TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { selectNavigationEvent } from 'app/store/navigation-event.selectors';
import { navigationEventClearAction } from 'app/store/navigation-event.actions';
import { FormComponent } from '../form.component';
import {
  TransactionType,
  ReportTypes,
  TransactionTemplateMapType,
  Contact,
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
  cloneNavigationEvent,
} from 'app/shared/models';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { ConfirmationWrapperService } from 'app/shared/services/confirmation-wrapper.service';
import { GlossaryService } from '../glossary/glossary.service';
import { environment } from 'environments/environment';

@Component({
  template: '',
})
export abstract class TransactionTypeBaseComponent extends FormComponent implements OnInit, OnDestroy {
  private readonly glossaryService = inject(GlossaryService);
  protected readonly messageService = inject(MessageService);
  readonly transactionService = inject(TransactionService);
  protected readonly contactService = inject(ContactService);
  readonly confirmationService = inject(ConfirmationWrapperService);
  protected readonly router = inject(Router);
  protected readonly fecDatePipe = inject(FecDatePipe);
  protected readonly reportService = inject(ReportService);
  protected readonly activatedRoute = inject(ActivatedRoute);

  protected readonly navigationEvent = this.store.selectSignal(selectNavigationEvent);

  readonly transaction = model<Transaction>();
  readonly transactionType = computed(() => this.transaction()?.transactionType);
  readonly templateMap = computed<TransactionTemplateMapType>(
    () => this.transactionType()?.templateMap ?? ({} as TransactionTemplateMapType),
  );
  readonly formProperties = computed(() => this.transactionType()?.getFormControlNames() ?? []);
  readonly contactTypeOptions = computed(() => getContactTypeOptions(this.transactionType()?.contactTypeOptions ?? []));

  readonly activeReportId: string = this.activatedRoute.snapshot.params['reportId'] ?? '';
  readonly showGlossary = environment.showGlossary;
  readonly reportTypes = ReportTypes;
  readonly saveSuccessMessage: ToastMessageOptions = {
    severity: 'success',
    summary: 'Successful',
    detail: 'Transaction Saved',
    life: 3000,
  };

  contactIdMap: ContactIdMapType = {};

  form: FormGroup = this.fb.group({}, { updateOn: 'blur' });
  readonly isEditable = computed(
    () =>
      this.reportService.isEditable(this.activeReport()) &&
      !ReattRedesUtils.isCopyFromPreviousReport(this.transaction()),
  );
  memoHasOptional$ = of(false);

  constructor() {
    super();
    effect(() => {
      if (!this.isEditable()) this.form.disable();
    });

    effect(() => {
      const navEvent = this.navigationEvent();
      if (navEvent?.transaction) {
        const navigationEvent = cloneNavigationEvent(navEvent);
        this.handleNavigate(navigationEvent);
        this.store.dispatch(navigationEventClearAction());
      }
    });
  }

  ngOnInit(): void {
    const transaction = this.transaction();
    if (!transaction || !transaction.transactionType.templateMap) {
      throw new Error('FECfile+: Template map not found for transaction component');
    }

    this.form = this.fb.group(
      SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties(), transaction.transactionType.schema),
      { updateOn: 'blur' },
    );

    this.memoHasOptional$ = this.getMemoHasOptional$(this.form, transaction.transactionType);

    TransactionFormUtils.onInit(this, this.form, transaction, this.contactIdMap, this.contactService);

    // Determine if amount should always be negative and then force it to be so if needed
    if (transaction.transactionType?.negativeAmountValueOnly && transaction.transactionType.templateMap?.amount) {
      this.form
        .get(transaction.transactionType.templateMap.amount)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((amount) => {
          if (+amount > 0) {
            this.form.patchValue({ [transaction.transactionType.templateMap.amount]: -1 * amount });
          }
        });
    }

    // If this single-entry transaction has inherited fields from its parent, load values
    // from parent on create and set field to read-only. For edit, just make
    // the fields read-only
    if (transaction.transactionType?.getInheritedFields(transaction)) {
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

  async submit(navigationEvent: NavigationEvent): Promise<void> {
    // update all contacts with changes from form.
    const transaction = this.transaction();
    if (transaction) {
      TransactionContactUtils.updateContactsWithForm(transaction, transaction.transactionType.templateMap, this.form);
    } else {
      this.store.dispatch(singleClickEnableAction());
      throw new Error('FECfile+: No transactions submitted for single-entry transaction form.');
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      transaction,
      this.activeReportId,
      this.form,
      this.formProperties(),
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

  async getConfirmations(): Promise<boolean> {
    const transaction = this.transaction();
    if (!transaction) return false;
    return this.confirmationService.confirmWithUser(
      this.form,
      transaction.transactionType?.contactConfig ?? {},
      this.getContact.bind(this),
      this.getTemplateMap.bind(this),
      transaction,
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
      if (!(await this.validateForm())) return;

      const confirmed = await this.getConfirmations();
      // if every confirmation was accepted
      if (confirmed) await this.submit(navigationEvent);
    } else {
      await this.navigateTo(navigationEvent);
    }
    this.store.dispatch(singleClickEnableAction());
  }

  async navigateTo(event: NavigationEvent): Promise<boolean> {
    /**
     * Interpret event to navigate to correct destination.
     *  - If the destination is ANOTHER, navigate to create another transaction of the same type
     *      (a child of the current transaction's parent if it exists)
     *  - If the destination is CHILD, navigate to create a sub-transaction of the current transaction
     */
    let result: boolean;
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    const reportPath = `/reports/transactions/report/${reportId}`;
    // If the transaction is saved, display a success message
    if (event.action === NavigationAction.SAVE) {
      this.messageService.add(this.saveSuccessMessage);
    }

    switch (event.destination) {
      case NavigationDestination.CLONE: {
        const newTransaction = Object.assign(
          Object.create(Object.getPrototypeOf(event.transaction)),
          event.transaction,
        );
        newTransaction.id = undefined;
        newTransaction.transaction_id = undefined;
        newTransaction.parent_transaction_id = undefined;
        newTransaction.debt_id = undefined;
        newTransaction.loan_id = undefined;
        newTransaction.reatt_redes_id = undefined;
        this.transaction.set(newTransaction);
        return true;
      }
      case NavigationDestination.ANOTHER:
        if (event.transaction?.parent_transaction_id) {
          result = await this.router.navigateByUrl(
            `${reportPath}/list/${event.transaction?.parent_transaction_id}/create-sub-transaction/${event.destinationTransactionType}`,
            { onSameUrlNavigation: 'reload' },
          );
          // Otherwise, navigate to create another tier 1 transaction
        } else {
          result = await this.router.navigateByUrl(`${reportPath}/create/${event.destinationTransactionType}`, {
            onSameUrlNavigation: 'reload',
          });
        }
        break;
      case NavigationDestination.CHILD:
        result = await this.router.navigateByUrl(
          `${reportPath}/list/${event.transaction?.id}/create-sub-transaction/${event.destinationTransactionType}`,
        );
        break;
      case NavigationDestination.PARENT:
        result = await this.router.navigateByUrl(`${reportPath}/list/${event.transaction?.parent_transaction_id}`);
        break;

      default:
        result = await this.router.navigateByUrl(`${reportPath}/list`);
    }
    this.resetForm();
    return result;
  }

  resetForm() {
    this.formSubmitted = false;
    this.form = TransactionFormUtils.resetForm(
      this.form,
      this.transaction(),
      this.contactTypeOptions(),
      this.committeeAccount(),
    );
  }

  updateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    this.transaction.set(
      TransactionContactUtils.updateFormWithPrimaryContact(
        selectItem,
        this.form,
        this.transaction(),
        this.contactIdMap['contact_1'],
      ),
    );
  }

  clearFormPrimaryContact() {
    this.transaction.set(
      TransactionContactUtils.clearFormPrimaryContact(this.form, this.transaction(), this.contactIdMap['contact_1']),
    );
  }

  updateFormWithCandidateContact(selectItem: SelectItem<Contact>) {
    this.transaction.set(
      TransactionContactUtils.updateFormWithCandidateContact(
        selectItem,
        this.form,
        this.transaction(),
        this.contactIdMap['contact_2'],
      ),
    );
  }

  updateFormWithSecondaryContact(selectItem: SelectItem<Contact>) {
    this.transaction.set(
      TransactionContactUtils.updateFormWithSecondaryContact(
        selectItem,
        this.form,
        this.transaction(),
        this.contactIdMap['contact_2'],
      ),
    );
  }

  updateFormWithTertiaryContact(selectItem: SelectItem<Contact>) {
    this.transaction.set(
      TransactionContactUtils.updateFormWithTertiaryContact(
        selectItem,
        this.form,
        this.transaction(),
        this.contactIdMap['contact_3'],
      ),
    );
  }

  updateFormWithQuaternaryContact(selectItem: SelectItem<Contact>) {
    this.transaction.set(
      TransactionContactUtils.updateFormWithQuaternaryContact(
        selectItem,
        this.form,
        this.transaction(),
        this.contactIdMap['contact_4'],
      ),
    );
  }

  clearFormQuaternaryContact() {
    this.transaction.set(
      TransactionContactUtils.clearFormQuaternaryContact(this.form, this.transaction(), this.contactIdMap['contact_4']),
    );
  }

  updateFormWithQuinaryContact(selectItem: SelectItem<Contact>) {
    this.transaction.set(
      TransactionContactUtils.updateFormWithQuinaryContact(
        selectItem,
        this.form,
        this.transaction(),
        this.contactIdMap['contact_5'],
      ),
    );
  }

  clearFormQuinaryContact() {
    this.transaction.set(
      TransactionContactUtils.clearFormQuinaryContact(this.form, this.transaction(), this.contactIdMap['contact_5']),
    );
  }

  // Display optional in label if the control is NOT readonly and DOES NOT have the Required Validator
  getMemoHasOptional$(form: FormGroup, transactionType: TransactionType): Observable<boolean> {
    const memoControl = form.get(transactionType?.templateMap.memo_code);
    if (TransactionFormUtils.isMemoCodeReadOnly(transactionType) || !memoControl) return of(false);
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
    const transaction = this.transaction();
    if (!transaction) throw new Error('FECfile+: No transaction found in initIneheritedFieldsFromParent');

    // If creating a new transaction, set both form and contact_1 values from parent transaction
    if (!transaction.id) {
      const ancestor = transaction.parent_transaction ?? transaction.debt ?? transaction.loan;
      transaction.contact_1 = ancestor?.contact_1;
      transaction.contact_1_id = ancestor?.contact_1_id;

      const entityTypeValue = ancestor?.contact_1?.type;
      if (entityTypeValue) this.form.get('entity_type')?.setValue(entityTypeValue);
      this.form.get('entity_type')?.updateValueAndValidity();

      transaction.transactionType.getInheritedFields(transaction)?.forEach((inherittedField) => {
        if (ancestor && transaction) {
          const fieldControl = this.form.get(transaction.transactionType.templateMap[inherittedField]);
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
    transaction.transactionType.getInheritedFields(transaction)?.forEach((inherittedField) => {
      if (transaction) {
        const fieldControl = this.form.get(transaction.transactionType.templateMap[inherittedField]);
        fieldControl?.disable();
      }
    });

    this.transaction.set(Object.assign(Object.create(Object.getPrototypeOf(transaction)), transaction));
  }

  openGlossary() {
    this.glossaryService.search(this.transactionType()?.title ?? '');
  }
}
