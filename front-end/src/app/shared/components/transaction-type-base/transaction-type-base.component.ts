import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  GO_BACK_CONTROL,
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import {
  BehaviorSubject,
  map,
  of,
  Subject,
  takeUntil,
  startWith,
  Observable,
  delay,
  from,
  concatAll,
  reduce,
} from 'rxjs';
import { Contact, ContactTypeLabels, ContactTypes } from '../../models/contact.model';
import { TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';

@Component({
  template: '',
})
export abstract class TransactionTypeBaseComponent implements OnInit, OnDestroy {
  @Input() transaction: Transaction | undefined;

  formProperties: string[] = [];
  transactionType?: TransactionType;
  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  entityTypeControl?: FormControl;
  candidateContactTypeFormControl: FormControl = new FormControl(ContactTypes.CANDIDATE); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  candidateContactTypeOption: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);
  committeeContactTypeOption: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
  committeeContactTypeFormControl: FormControl = new FormControl(ContactTypes.COMMITTEE); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  destroy$: Subject<boolean> = new Subject<boolean>();
  contactId$: Subject<string> = new BehaviorSubject<string>('');
  formSubmitted = false;
  purposeDescriptionLabel = '';
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  form: FormGroup = this.fb.group({});
  isEditable = true;
  memoCodeCheckboxLabel$ = of('');

  constructor(
    protected messageService: MessageService,
    public transactionService: TransactionService,
    protected contactService: ContactService,
    protected confirmationService: ConfirmationService,
    protected fb: FormBuilder,
    protected router: Router,
    protected fecDatePipe: FecDatePipe,
    protected store: Store,
    protected reportService: ReportService
  ) {}

  ngOnInit(): void {
    if (!this.transaction?.transactionType?.templateMap) {
      throw new Error('Fecfile: Template map not found for transaction component');
    }
    this.transactionType = this.transaction.transactionType;
    this.templateMap = this.transactionType.templateMap;
    this.formProperties = this.transactionType.getFormControlNames(this.templateMap);
    this.contactTypeOptions = getContactTypeOptions(this.transactionType.contactTypeOptions ?? []);

    this.form = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));

    this.form.addControl('contact_1', new FormControl());
    this.form.addControl(
      'contact_2',
      new FormControl(null, () => {
        if (!this.transaction?.contact_2 && this.transactionType?.contact2IsRequired) {
          return { required: true };
        }
        return null;
      })
    );

    this.form.addControl(
      'contact_3',
      new FormControl(null, () => {
        if (!this.transaction?.contact_3 && this.transactionType?.contact3IsRequired) {
          return { required: true };
        }
        return null;
      })
    );

    this.memoCodeCheckboxLabel$ = this.getMemoCodeCheckboxLabel$(this.form, this.transactionType);

    TransactionFormUtils.onInit(this, this.form, this.transaction, this.contactId$);
    this.entityTypeControl = this.form.get('entity_type') as FormControl;
    this.parentOnInit();
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.isEditable = this.reportService.isEditable(report);
        if (!this.isEditable) this.form.disable();
      });
  }

  parentOnInit() {
    const transactionType = this.transactionType;
    // Determine if amount should always be negative and then force it to be so if needed
    if (transactionType?.negativeAmountValueOnly && this.templateMap?.amount) {
      this.form
        .get(this.templateMap.amount)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((amount) => {
          if (+amount > 0) {
            this.form.patchValue({ [this.templateMap.amount]: -1 * amount });
          }
        });
    }

    if (transactionType?.generatePurposeDescriptionLabel) {
      this.purposeDescriptionLabel = transactionType.generatePurposeDescriptionLabel();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.contactId$.complete();
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
      TransactionContactUtils.updateContactWithForm(this.transaction, this.templateMap, this.form);
    } else {
      throw new Error('Fecfile: No transactions submitted for double-entry transaction form.');
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.form,
      this.formProperties
    );
    if (payload.transaction_type_identifier) {
      const responseFromApi = this.writeToApi(payload);
      responseFromApi.subscribe((transaction) => {
        navigationEvent.transaction = this.transactionType?.updateParentOnSave ? payload : transaction;
        this.navigateTo(navigationEvent);
      });
    }
  }

  confirmWithUser(transaction: Transaction, form: FormGroup, targetDialog: 'dialog' | 'childDialog' = 'dialog') {
    const templateMap = transaction.transactionType?.templateMap;
    if (!templateMap) {
      throw new Error('Fecfile: Cannot find template map when confirming transaction');
    }
    const confirmations$ = Object.entries(transaction.transactionType?.contactConfig ?? {})
      .map(([contactKey, config]: [string, { [formField: string]: string }]) => {
        if (transaction[contactKey as keyof Transaction]) {
          const contact = transaction[contactKey as keyof Transaction] as Contact;
          if (!contact.id) {
            return TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
              contact.type,
              form,
              templateMap
            );
          }
          const changes = TransactionContactUtils.getContactChanges(form, contact, templateMap, config);
          const dateString = this.fecDatePipe.transform(form.get(templateMap.date)?.value);
          if (changes.length > 0) {
            return TransactionContactUtils.getContactChangesMessage(contact, dateString, changes);
          }
        }
        return '';
      })
      .filter((message) => !!message)
      .map((message: string) => {
        return new Observable<boolean>((subscriber) => {
          this.confirmationService.confirm({
            key: targetDialog,
            header: 'Confirm',
            icon: 'pi pi-info-circle',
            message: message,
            acceptLabel: 'Continue',
            rejectLabel: 'Cancel',
            accept: () => {
              subscriber.next(true);
              subscriber.complete();
            },
            reject: () => {
              subscriber.next(false);
              subscriber.complete();
            },
          });
        }).pipe(delay(500));
      });

    return from([of(true), ...confirmations$]).pipe(
      concatAll(),
      reduce((accumulator, confirmed) => accumulator && confirmed)
    );
  }

  getNavigationControls(): TransactionNavigationControls {
    if (!this.isEditable) return new TransactionNavigationControls([], [GO_BACK_CONTROL], []);
    return this.transactionType?.navigationControls ?? new TransactionNavigationControls([], [], []);
  }

  getInlineControls(): NavigationControl[] {
    return this.getNavigationControls().getNavigationControls('inline', this.transaction);
  }

  handleNavigate(navigationEvent: NavigationEvent): void {
    this.formSubmitted = true;

    if (navigationEvent.action === NavigationAction.SAVE) {
      if (this.form.invalid || !this.transaction) {
        return;
      }
      this.confirmWithUser(this.transaction, this.form).subscribe((confirmed: boolean) => {
        // if every confirmation was accepted
        if (confirmed) this.save(navigationEvent);
      });
    } else {
      this.navigateTo(navigationEvent);
    }
  }

  navigateTo(event: NavigationEvent) {
    const reportPath = `/reports/transactions/report/${event.transaction?.report_id}`;
    if (
      event.destination === NavigationDestination.ANOTHER ||
      event.destination === NavigationDestination.ANOTHER_CHILD
    ) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Transaction Saved',
        life: 3000,
      });
      if (event.transaction?.parent_transaction_id) {
        this.router.navigateByUrl(
          `${reportPath}/list/${event.transaction?.parent_transaction_id}/create-sub-transaction/${event.destinationTransactionType}`
        );
      } else {
        this.router.navigateByUrl(`${reportPath}/create/${event.destinationTransactionType}`);
      }
    } else if (event.destination === NavigationDestination.CHILD) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Parent Transaction Saved',
        life: 3000,
      });
      this.router.navigateByUrl(
        `${reportPath}/list/${event.transaction?.id}/create-sub-transaction/${event.destinationTransactionType}`
      );
    } else if (event.destination === NavigationDestination.PARENT) {
      this.router.navigateByUrl(`${reportPath}/list/${event.transaction?.parent_transaction_id}`);
    } else {
      this.router.navigateByUrl(`${reportPath}/list`);
    }
  }

  resetForm() {
    this.formSubmitted = false;
    TransactionFormUtils.resetForm(this.form, this.transaction, this.contactTypeOptions);
  }

  isDescriptionSystemGenerated(transactionType?: TransactionType): boolean {
    // Description is system generated if there is a defined function.  Otherwise, it's mutable
    return transactionType?.generatePurposeDescription !== undefined;
  }

  onContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onContactLookupSelect(selectItem, this.form, this.transaction, this.contactId$);
  }
  onSecondaryContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onSecondaryContactLookupSelect(selectItem, this.form, this.transaction);
  }
  onTertiaryContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onTertiaryContactLookupSelect(selectItem, this.form, this.transaction);
  }

  getEntityType(): string {
    return this.form.get('entity_type')?.value || '';
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
      takeUntil(this.destroy$)
    );
  }
}
