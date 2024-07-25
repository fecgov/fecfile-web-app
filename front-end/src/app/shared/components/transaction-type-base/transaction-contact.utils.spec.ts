import { FormControl, FormGroup } from '@angular/forms';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
import {
  testTemplateMap,
  testContact,
  testScheduleATransaction,
  getTestTransactionByType,
} from 'app/shared/utils/unit-test.utils';
import { TransactionContactUtils } from './transaction-contact.utils';
import { Subject } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { SchC1Transaction, ScheduleC1TransactionTypes } from 'app/shared/models/schc1-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';

describe('ContactUtils', () => {
  let form: FormGroup;
  let selectItem: SelectItem<Contact>;
  let contactId$: Subject<string>;

  beforeEach(() => {
    form = new FormGroup({
      contributor_last_name: new FormControl('test_ln'),
      contributor_first_name: new FormControl('test_fn'),
      contributor_middle_name: new FormControl(''),
      contributor_prefix: new FormControl(''),
      contributor_suffix: new FormControl(''),
      contributor_street_1: new FormControl(''),
      contributor_street_2: new FormControl(''),
      contributor_city: new FormControl(''),
      contributor_state: new FormControl(''),
      contributor_zip: new FormControl(''),
      contributor_employer: new FormControl(''),
      contributor_occupation: new FormControl(''),
      contributor_organization_name: new FormControl('test_org_name'),
      donor_candidate_last_name: new FormControl('test_candidate_ln'),
      donor_candidate_first_name: new FormControl('test_candidate_fn'),
      donor_committee_fec_id: new FormControl(''),
      donor_committee_name: new FormControl('test_com_name'),
      donor_candidate_fec_id: new FormControl(''),
      donor_candidate_middle_name: new FormControl(''),
      donor_candidate_prefix: new FormControl(''),
      donor_candidate_suffix: new FormControl(''),
      donor_candidate_office: new FormControl(''),
      donor_candidate_state: new FormControl(''),
      donor_candidate_district: new FormControl(''),
      ind_name_account_location: new FormControl('secondary_org_name'),
      account_street_1: new FormControl(''),
      account_street_2: new FormControl(''),
      account_city: new FormControl(''),
      account_state: new FormControl(''),
      account_zip: new FormControl(''),
      beneficiary_committee_fec_id: new FormControl(''),
      beneficiary_committee_name: new FormControl(''),
    });

    selectItem = {
      label: '',
      value: testContact,
      styleClass: '',
      icon: '',
      title: '',
      disabled: false,
    };

    contactId$ = new Subject();
  });

  it('test getCreateTransactionContactConfirmationMessage', () => {
    let output = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
      ContactTypes.INDIVIDUAL,
      form,
      testTemplateMap,
      'contact_1',
    );
    expect(output).toBe(
      "By saving this transaction, you're also creating a new individual contact for <b> test_ln, test_fn</b>.",
    );

    output = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
      ContactTypes.COMMITTEE,
      form,
      testTemplateMap,
      'contact_1',
    );
    expect(output).toBe(
      "By saving this transaction, you're also creating a new committee contact for <b> test_org_name</b>.",
    );

    output = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
      ContactTypes.COMMITTEE,
      form,
      testTemplateMap,
      'contact_3',
    );
    expect(output).toBe(
      "By saving this transaction, you're also creating a new committee contact for <b> test_com_name</b>.",
    );

    output = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
      ContactTypes.ORGANIZATION,
      form,
      testTemplateMap,
      'contact_1',
    );
    expect(output).toBe(
      "By saving this transaction, you're also creating a new organization contact for <b> test_org_name</b>.",
    );

    output = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
      ContactTypes.ORGANIZATION,
      form,
      testTemplateMap,
      'contact_2',
    );
    expect(output).toBe(
      "By saving this transaction, you're also creating a new organization contact for <b> secondary_org_name</b>.",
    );

    output = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
      ContactTypes.CANDIDATE,
      form,
      testTemplateMap,
      'contact_2',
    );
    expect(output).toBe(
      "By saving this transaction, you're also creating a new candidate contact for <b> test_candidate_ln, test_candidate_fn</b>.",
    );
  });

  it('test updateFormWithPrimaryContact', () => {
    TransactionContactUtils.updateFormWithPrimaryContact(selectItem, form, testScheduleATransaction, contactId$);
    expect(form.get('contributor_last_name')?.value).toBe('Smith');
    expect(form.get('contributor_first_name')?.value).toBe('Joe');
    expect(form.get('contributor_middle_name')?.value).toBe('James');
    expect(form.get('contributor_prefix')?.value).toBe('Mr');
    expect(form.get('contributor_suffix')?.value).toBe('Jr');
    expect(form.get('contributor_employer')?.value).toBe('Plumbing, Inc.');
    expect(form.get('contributor_occupation')?.value).toBe('plumber');
    expect(form.get('contributor_street_1')?.value).toBe('123 Main St');
    expect(form.get('contributor_street_2')?.value).toBe('Apt B');
    expect(form.get('contributor_city')?.value).toBe('Anytown');
    expect(form.get('contributor_state')?.value).toBe('VA');
    expect(form.get('contributor_zip')?.value).toBe('22201');

    selectItem.value.type = ContactTypes.COMMITTEE;
    TransactionContactUtils.updateFormWithPrimaryContact(selectItem, form, testScheduleATransaction, contactId$);
    expect(form.get('contributor_organization_name')?.value).toBe('Organization LLC');
    expect(form.get('donor_committee_fec_id')?.value).toBe('888');
    expect(form.get('donor_committee_name')?.value).toBe('Organization LLC');

    selectItem.value.type = ContactTypes.ORGANIZATION;
    TransactionContactUtils.updateFormWithPrimaryContact(selectItem, form, testScheduleATransaction, contactId$);
    expect(form.get('contributor_organization_name')?.value).toBe('Organization LLC');
  });

  it('test updateFormWithCandidateContact', () => {
    TransactionContactUtils.updateFormWithCandidateContact(
      selectItem,
      form,
      testScheduleATransaction,
      new Subject<string>(),
    );
    expect(form.get('donor_candidate_fec_id')?.value).toBe('999');
    expect(form.get('donor_candidate_last_name')?.value).toBe('Smith');
    expect(form.get('donor_candidate_first_name')?.value).toBe('Joe');
    expect(form.get('donor_candidate_middle_name')?.value).toBe('James');
    expect(form.get('donor_candidate_prefix')?.value).toBe('Mr');
    expect(form.get('donor_candidate_suffix')?.value).toBe('Jr');
    expect(form.get('donor_candidate_office')?.value).toBe('H');
    expect(form.get('donor_candidate_state')?.value).toBe('VA');
    expect(form.get('donor_candidate_district')?.value).toBe('1');
    expect(testScheduleATransaction.contact_2).toBeTruthy();
  });

  it('test updateFormWithSecondaryContact', () => {
    const transaction = getTestTransactionByType(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT) as SchC1Transaction;
    TransactionContactUtils.updateFormWithSecondaryContact(selectItem, form, transaction, new Subject<string>());
    expect(form.get('ind_name_account_location')?.value).toBe('Organization LLC');
    expect(form.get('account_street_1')?.value).toBe('123 Main St');
    expect(form.get('account_street_2')?.value).toBe('Apt B');
    expect(form.get('account_city')?.value).toBe('Anytown');
    expect(form.get('account_state')?.value).toBe('VA');
    expect(form.get('account_zip')?.value).toBe('22201');
    expect(transaction.contact_2).toBeTruthy();
  });

  it('test updateFormWithSecondaryContact', () => {
    const transaction = getTestTransactionByType(
      ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE,
    ) as SchBTransaction;
    TransactionContactUtils.updateFormWithTertiaryContact(selectItem, form, transaction, new Subject<string>());
    expect(form.get('beneficiary_committee_name')?.value).toBe('Organization LLC');
    expect(form.get('beneficiary_committee_fec_id')?.value).toBe('888');
    expect(transaction.contact_3).toBeTruthy();
  });
});
