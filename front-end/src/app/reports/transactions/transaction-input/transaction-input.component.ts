import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, model, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
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
import { effectOnceIf } from 'ngxtension/effect-once-if';

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
  ],
})
export class TransactionInputComponent {
  readonly form = input<FormGroup>(new FormGroup([], { updateOn: 'blur' }));
  readonly formSubmitted = input(false);
  readonly transaction = input<Transaction>();
  readonly isEditable = input(true);
  readonly contactTypeOptions = input(LabelUtils.getPrimeOptions(ContactTypeLabels));
  readonly memoCodeCheckboxLabel = input<string>();
  readonly contributionAmountReadOnly = input(false);
  readonly candidateInfoPosition = model('low');
  readonly isSingle = input(false);

  readonly primaryContactSelect = output<SelectItem<Contact>>();
  readonly candidateContactSelect = output<SelectItem<Contact>>();
  readonly secondaryContactSelect = output<SelectItem<Contact>>();
  readonly tertiaryContactSelect = output<SelectItem<Contact>>();
  readonly quaternaryContactSelect = output<SelectItem<Contact>>();
  readonly quaternaryContactClear = output<void>();
  readonly quinaryContactSelect = output<SelectItem<Contact>>();
  readonly quinaryContactClear = output<void>();

  readonly ContactTypes = ContactTypes;
  readonly transactionType = computed(() => this.transaction()?.transactionType);
  readonly templateMap = computed(() => this.transactionType()?.templateMap ?? ({} as TransactionTemplateMapType));
  readonly candidateContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.CANDIDATE,
  ]);
  readonly committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.COMMITTEE,
  ]);

  constructor() {
    effect(() => {
      this.candidateInfoPosition.set(this.transactionType()?.candidateInfoPosition ?? 'low');
    });

    effectOnceIf(
      () => this.transactionType(),
      () => {
        const type = this.transactionType();
        if (!type) return;
        for (const field in type.mandatoryFormValues) {
          this.form().get(field)?.setValue(type.mandatoryFormValues[field]);
          this.form().get(field)?.disable();
        }
      },
    );
  }

  contactTypeSelected(contactType: ContactTypes) {
    this.form().get('entity_type')?.setValue(contactType);
  }

  updateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    this.form().get('entity_type')?.setValue(selectItem.value.type);
    this.primaryContactSelect.emit(selectItem);
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

  get entityType(): ContactTypes {
    return this.form().get('entity_type')?.value;
  }

  readonly signatoryOneHeader = computed(() => this.transactionType()?.signatoryOneHeader ?? '');
  readonly signatoryTwoHeader = computed(() => this.transactionType()?.signatoryTwoHeader ?? '');
  readonly amountInputHeader = computed(() => this.transactionType()?.amountInputHeader ?? '');
  readonly debtInputHeader = computed(() => this.transactionType()?.debtInputHeader ?? '');
  readonly committeeCandidateHeader = computed(() => this.transactionType()?.committeeCandidateHeader ?? '');
}
