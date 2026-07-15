import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, Input, OnInit, Output, Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { HighLow, TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { SelectItem } from 'primeng/api';
import { Observable, of, startWith, switchMap } from 'rxjs';
import { AdditionalInfoInputComponent } from '../../../shared/components/inputs/additional-info-input/additional-info-input.component';
import { AddressInputComponent } from '../../../shared/components/inputs/address-input/address-input.component';
import { AmountInputComponent } from '../../../shared/components/inputs/amount-input/amount-input.component';
import { CandidateInputComponent } from '../../../shared/components/inputs/candidate-input/candidate-input.component';
import { CommitteeInputComponent } from '../../../shared/components/inputs/committee-input/committee-input.component';
import { DebtInputComponent } from '../../../shared/components/inputs/debt-input/debt-input.component';
import { ElectionInputComponent } from '../../../shared/components/inputs/election-input/election-input.component';
import { EmployerInputComponent } from '../../../shared/components/inputs/employer-input/employer-input.component';
import { LoanAgreementInputComponent } from '../../../shared/components/inputs/loan-agreement-input/loan-agreement-input.component';
import { LoanInfoInputComponent } from '../../../shared/components/inputs/loan-info-input/loan-info-input.component';
import { LoanTermsInputComponent } from '../../../shared/components/inputs/loan-terms-input/loan-terms-input.component';
import { NameInputComponent } from '../../../shared/components/inputs/name-input/name-input.component';
import { SignatureInputComponent } from '../../../shared/components/inputs/signature-input/signature-input.component';
import { SupportOpposeInputComponent } from '../../../shared/components/inputs/support-oppose-input/support-oppose-input.component';
import { TransactionContactLookupComponent } from '../../../shared/components/transaction-contact-lookup/transaction-contact-lookup.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transaction-input',
  templateUrl: './transaction-input.component.html',
  styleUrls: ['../transaction.scss'],
  imports: [
    TransactionContactLookupComponent,
    CommitteeInputComponent,
    NameInputComponent,
    SectionHeaderComponent,
    AddressInputComponent,
    EmployerInputComponent,
    NgTemplateOutlet,
    AmountInputComponent,
    DebtInputComponent,
    LoanInfoInputComponent,
    LoanTermsInputComponent,
    LoanAgreementInputComponent,
    AdditionalInfoInputComponent,
    SignatureInputComponent,
    SupportOpposeInputComponent,
    CandidateInputComponent,
    ElectionInputComponent,
    AsyncPipe,
  ],
})
export class TransactionInputComponent implements OnInit {
  readonly form = input.required<FormGroup>();
  @Input() formSubmitted = false;
  readonly transaction = input<Transaction>();
  readonly isEditable = input(true);
  @Input() contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  @Input() memoHasOptional$?: Observable<boolean>;
  @Input() contributionAmountReadOnly = false;
  @Input() isSingle = false;

  @Output() primaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() primaryContactClear = new EventEmitter<void>();
  @Output() candidateContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() secondaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() tertiaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() quaternaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() quaternaryContactClear = new EventEmitter<void>();
  @Output() quinaryContactSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() quinaryContactClear = new EventEmitter<void>();

  readonly store = inject(Store);
  readonly activeReport = this.store.selectSignal(selectActiveReport);

  ContactTypes = ContactTypes;
  readonly transactionType = computed(() => this.transaction()?.transactionType);
  readonly templateMap = computed(
    () => this.transaction()?.transactionType.templateMap || ({} as TransactionTemplateMapType),
  );
  readonly isReattributable = computed(() => this.transactionType()?.isReattributable);
  readonly showLookup = computed(() => {
    const transaction = this.transaction();
    if (!transaction) return false;
    return (
      this.isEditable() &&
      !transaction.transactionType.getUseParentContact(transaction) &&
      !transaction.transactionType.hideContactLookup &&
      transaction.transaction_type_identifier !== 'LOAN_REPAYMENT_MADE' &&
      transaction.transaction_type_identifier !== 'LOAN_REPAYMENT_RECEIVED'
    );
  });
  readonly footer = computed(() => this.transactionType()?.getFooter(this.transaction()));
  readonly candidateContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.CANDIDATE,
  ]);
  readonly committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.COMMITTEE,
  ]);

  readonly candidateInfoPosition: Signal<HighLow> = computed(
    () => this.transactionType()?.candidateInfoPosition || 'low',
  );

  readonly supportOpposeControl = computed(() => this.form().get('support_oppose_code'));
  readonly supportOppose: Signal<boolean | undefined> = toSignal(
    toObservable(this.supportOpposeControl).pipe(
      switchMap((control) => {
        if (!control) return of(undefined);
        return control.valueChanges.pipe(startWith(control.value));
      }),
    ),
  );
  readonly entityTypeControl = computed(() => this.form().get('entity_type'));
  readonly entityType: Signal<ContactTypes | undefined> = toSignal(
    toObservable(this.entityTypeControl).pipe(
      switchMap((control) => {
        if (!control) return of(undefined);
        return control.valueChanges.pipe(startWith(control.value));
      }),
    ),
  );

  readonly hasElectionInfo = computed(() =>
    this.transactionType()?.hasElectionInformation(this.activeReport().report_type),
  );

  readonly hasSignature1 = computed(() => this.transactionType()?.hasSignature1());
  readonly hasSignature2 = computed(() => this.transactionType()?.hasSignature2());
  readonly hasCommitteeOrCandidateInformation = computed(() =>
    this.transactionType()?.hasCommitteeOrCandidateInformation(),
  );
  readonly hasSupportOpposeCode = computed(() => this.transactionType()?.hasSupportOpposeCode());
  readonly showCandidateInformation = computed(
    () =>
      !!this.transactionType()?.hasCandidateInformation() &&
      (this.supportOppose() !== undefined || !this.hasSupportOpposeCode()),
  );
  readonly contact2isOptional = computed(() => !this.transactionType()?.contact2IsRequired(this.form()));
  readonly includeFecId = computed(() => this.transactionType()?.hasCommitteeFecId() ?? false);
  readonly showEmployerInput = computed(
    () => this.transactionType()?.hasEmployeeFields() && this.entityType() === ContactTypes.INDIVIDUAL,
  );
  readonly showLoanTermsInput = computed(
    () => this.transactionType()?.hasLoanTermsFields() && !this.transactionType()?.hasLoanAgreement,
  );
  readonly hasLoanFinanceFields = computed(() => !!this.transactionType()?.hasLoanFinanceFields());
  readonly hasCandidateOffice = computed(() => !!this.transactionType()?.hasLoanFinanceFields());

  ngOnInit(): void {
    const transactionType = this.transactionType();
    if (!transactionType) throw new Error('FECfile+: No transaction passed to TransactionInputComponent');

    // If there are mandatory values for any form fields, populate the form field and make it read-only
    for (const field in transactionType.mandatoryFormValues) {
      this.form().get(field)?.setValue(transactionType.mandatoryFormValues[field]);
      this.form().get(field)?.disable();
    }
  }

  contactTypeSelected(contactType: ContactTypes) {
    const currentType = this.form().get('entity_type')?.value;
    if (contactType !== currentType) {
      this.form().get('entity_type')?.setValue(contactType);
      this.clearFormPrimaryContact();
    }
  }

  updateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    this.form().get('entity_type')?.setValue(selectItem.value.type);
    this.primaryContactSelect.emit(selectItem);
  }

  clearFormPrimaryContact() {
    this.primaryContactClear.emit();
  }

  updateFormWithCandidateContact(selectItem: SelectItem<Contact>) {
    this.candidateContactSelect.emit(selectItem);
  }

  updateFormWithSecondaryContact(selectItem: SelectItem<Contact>) {
    this.secondaryContactSelect.emit(selectItem);
  }

  updateFormWithTertiaryContact(selectItem: SelectItem<Contact>) {
    this.tertiaryContactSelect.emit(selectItem);
  }

  updateFormWithQuaternaryContact(selectItem: SelectItem<Contact>) {
    this.quaternaryContactSelect.emit(selectItem);
  }

  clearFormQuaternaryContact() {
    this.quaternaryContactClear.emit();
  }

  updateFormWithQuinaryContact(selectItem: SelectItem<Contact>) {
    this.quinaryContactSelect.emit(selectItem);
  }

  clearFormQuinaryContact() {
    this.quinaryContactClear.emit();
  }
}
