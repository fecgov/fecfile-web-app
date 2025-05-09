import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, Input, model, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { Observable } from 'rxjs';
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
  readonly formSubmitted = input.required<boolean>();
  readonly transaction = input.required<Transaction>();
  readonly contactTypeOptions = input.required<PrimeOptions>();
  readonly isEditable = input(true);
  readonly memoCodeCheckboxLabel$ = input<Observable<string>>();
  readonly contributionAmountReadOnly = input(false);
  readonly isSingle = input(false);

  readonly primaryContact = signal<Contact>(new Contact());
  readonly secondaryContact = signal<Contact>(new Contact());
  readonly tertiaryContact = signal<Contact>(new Contact());
  readonly candidateContact = signal<Contact>(new Contact());
  readonly designatingCommittee = signal<Contact | null>(null);
  readonly subordinateCommitee = signal<Contact | null>(null);

  readonly contactType = signal<ContactTypes>(ContactTypes.INDIVIDUAL);
  readonly isCandidate = computed(() => this.contactType() === ContactTypes.CANDIDATE);
  readonly isCommittee = computed(() => this.contactType() === ContactTypes.COMMITTEE);
  readonly isIndividual = computed(() => this.contactType() === ContactTypes.INDIVIDUAL);
  readonly isOrganization = computed(() => this.contactType() === ContactTypes.ORGANIZATION);

  readonly transactionType = computed(() => this.transaction().transactionType);
  readonly templateMap = computed(() => this.transactionType().templateMap);
  readonly footer = computed(() => this.transactionType().getFooter(this.transaction()));
  readonly hasSupportOppose = computed(() => this.transactionType().hasSupportOpposeCode());
  readonly hasCandidateInfo = computed(() => this.transactionType().hasCandidateInformation());
  readonly hasCandidateOffice = computed(() => this.transactionType().hasCandidateOffice());
  readonly hasElectionInfo = computed(() => this.transactionType().hasElectionInformation());
  readonly hasSignature1 = computed(() => this.transactionType().hasSignature1());
  readonly hasSignature2 = computed(() => this.transactionType().hasSignature2());
  readonly contact3Required = computed(() => this.transactionType().contact3IsRequired());
  readonly hasCommitteeFecId = computed(() => this.transactionType().hasCommitteeFecId());
  readonly mandatoryFormValues = computed(() => this.transactionType()?.mandatoryFormValues);
  readonly isHigh = computed(() => this.transactionType().candidateInfoPosition === 'high');
  readonly isLow = computed(() => this.transactionType().candidateInfoPosition === 'low');
  readonly candidateContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.CANDIDATE,
  ]);
  readonly committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.COMMITTEE,
  ]);

  readonly showLookup = computed(
    () =>
      this.isEditable() &&
      !this.transactionType().getUseParentContact(this.transaction()) &&
      !this.transactionType().hideContactLookup &&
      this.transaction().transaction_type_identifier !== 'LOAN_REPAYMENT_MADE' &&
      this.transaction().transaction_type_identifier !== 'LOAN_REPAYMENT_RECEIVED',
  );

  constructor() {
    effect(() => {
      this.form().get('entity_type')?.setValue(this.primaryContact().type);
    });

    effect(() => {
      this.form().get('entity_type')?.setValue(this.contactType());
    });
  }

  ngOnInit(): void {
    this.contactType.set(this.form().get('entity_type')?.value);

    // If there are mandatory values for any form fields, populate the form field and make it read-only
    for (const field in this.mandatoryFormValues()) {
      this.form().get(field)?.setValue(this.mandatoryFormValues()[field]);
      this.form().get(field)?.disable();
    }
  }
}
