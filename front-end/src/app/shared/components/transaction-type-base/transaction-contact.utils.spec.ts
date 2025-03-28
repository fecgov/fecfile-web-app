import { FormBuilder, FormGroup } from '@angular/forms';
import { CandidateOfficeTypes, Contact, ContactTypes } from 'app/shared/models/contact.model';
import { SchBTransaction, ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { SchC1Transaction, ScheduleC1TransactionTypes } from 'app/shared/models/schc1-transaction.model';
import { ScheduleETransactionTypes, SchETransaction } from 'app/shared/models/sche-transaction.model';
import { ScheduleFTransactionTypes, SchFTransaction } from 'app/shared/models/schf-transaction.model';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import {
  getTestTransactionByType,
  testContact,
  testScheduleATransaction,
  testTemplateMap,
} from 'app/shared/utils/unit-test.utils';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { TransactionContactUtils } from './transaction-contact.utils';

describe('ContactUtils', () => {
  let form: FormGroup;
  let selectItem: SelectItem<Contact>;
  let contactId$: Subject<string>;

  beforeEach(() => {
    form = new FormGroup(
      {
        contributor_last_name: new SubscriptionFormControl('test_ln'),
        contributor_first_name: new SubscriptionFormControl('test_fn'),
        contributor_middle_name: new SubscriptionFormControl(''),
        contributor_prefix: new SubscriptionFormControl(''),
        contributor_suffix: new SubscriptionFormControl(''),
        contributor_street_1: new SubscriptionFormControl(''),
        contributor_street_2: new SubscriptionFormControl(''),
        contributor_city: new SubscriptionFormControl(''),
        contributor_state: new SubscriptionFormControl(''),
        contributor_zip: new SubscriptionFormControl(''),
        contributor_employer: new SubscriptionFormControl(''),
        contributor_occupation: new SubscriptionFormControl(''),
        contributor_organization_name: new SubscriptionFormControl('test_org_name'),
        donor_candidate_last_name: new SubscriptionFormControl('test_candidate_ln'),
        donor_candidate_first_name: new SubscriptionFormControl('test_candidate_fn'),
        donor_committee_fec_id: new SubscriptionFormControl(''),
        donor_committee_name: new SubscriptionFormControl('test_com_name'),
        donor_candidate_fec_id: new SubscriptionFormControl(''),
        donor_candidate_middle_name: new SubscriptionFormControl(''),
        donor_candidate_prefix: new SubscriptionFormControl(''),
        donor_candidate_suffix: new SubscriptionFormControl(''),
        donor_candidate_office: new SubscriptionFormControl(''),
        donor_candidate_state: new SubscriptionFormControl(''),
        donor_candidate_district: new SubscriptionFormControl(''),
        ind_name_account_location: new SubscriptionFormControl('secondary_org_name'),
        account_street_1: new SubscriptionFormControl(''),
        account_street_2: new SubscriptionFormControl(''),
        account_city: new SubscriptionFormControl(''),
        account_state: new SubscriptionFormControl(''),
        account_zip: new SubscriptionFormControl(''),
        beneficiary_committee_fec_id: new SubscriptionFormControl(''),
        beneficiary_committee_name: new SubscriptionFormControl(''),
        designating_committee_id_number: new SubscriptionFormControl(''),
        designating_committee_name: new SubscriptionFormControl(''),
        subordinate_committee_id_number: new SubscriptionFormControl(''),
        subordinate_committee_name: new SubscriptionFormControl(''),
        subordinate_street_1: new SubscriptionFormControl(''),
        subordinate_street_2: new SubscriptionFormControl(''),
        subordinate_city: new SubscriptionFormControl(''),
        subordinate_state: new SubscriptionFormControl(''),
        subordinate_zip: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );

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

  it('test updateFormWithTertiaryContact', () => {
    const transaction = getTestTransactionByType(
      ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE,
    ) as SchBTransaction;
    TransactionContactUtils.updateFormWithTertiaryContact(selectItem, form, transaction, new Subject<string>());
    expect(form.get('beneficiary_committee_name')?.value).toBe('Organization LLC');
    expect(form.get('beneficiary_committee_fec_id')?.value).toBe('888');
    expect(transaction.contact_3).toBeTruthy();
  });

  it('test updateFormWithQuaternaryContact', () => {
    const transaction = getTestTransactionByType(
      ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ) as SchFTransaction;
    TransactionContactUtils.updateFormWithQuaternaryContact(selectItem, form, transaction, new Subject<string>());
    expect(form.get('designating_committee_id_number')?.value).toBe('888');
    expect(form.get('designating_committee_name')?.value).toBe('Organization LLC');
    expect(transaction.contact_4).toBeTruthy();
  });

  it('test updateFormWithQuaternaryContact and clearFormQuaternaryContact', () => {
    const transaction = getTestTransactionByType(
      ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ) as SchFTransaction;
    // updateFormWithQuaternaryContact
    TransactionContactUtils.updateFormWithQuaternaryContact(selectItem, form, transaction, new Subject<string>());
    expect(form.get('designating_committee_id_number')?.value).toBe('888');
    expect(form.get('designating_committee_name')?.value).toBe('Organization LLC');
    expect(transaction.contact_4).toBeTruthy();
    // clearFormQuaternaryContact
    TransactionContactUtils.clearFormQuaternaryContact(form, transaction, new Subject<string>());
    expect(form.get('designating_committee_id_number')?.value).toBe(null);
    expect(form.get('designating_committee_name')?.value).toBe(null);
    expect(transaction.contact_4).toBeFalsy();
  });

  it('test updateFormWithQuinaryContact and clearFormQuinaryContact', () => {
    const transaction = getTestTransactionByType(
      ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ) as SchFTransaction;
    // updateFormWithQuaternaryContact
    TransactionContactUtils.updateFormWithQuinaryContact(selectItem, form, transaction, new Subject<string>());
    expect(form.get('subordinate_committee_id_number')?.value).toBe('888');
    expect(form.get('subordinate_committee_name')?.value).toBe('Organization LLC');
    expect(form.get('subordinate_street_1')?.value).toBe('123 Main St');
    expect(form.get('subordinate_street_2')?.value).toBe('Apt B');
    expect(form.get('subordinate_city')?.value).toBe('Anytown');
    expect(form.get('subordinate_state')?.value).toBe('VA');
    expect(form.get('subordinate_zip')?.value).toBe('22201');
    expect(transaction.contact_5).toBeTruthy();
    // clearFormQuaternaryContact
    TransactionContactUtils.clearFormQuinaryContact(form, transaction, new Subject<string>());
    expect(form.get('subordinate_committee_id_number')?.value).toBe(null);
    expect(form.get('subordinate_committee_name')?.value).toBe(null);
    expect(form.get('subordinate_street_1')?.value).toBe(null);
    expect(form.get('subordinate_street_2')?.value).toBe(null);
    expect(form.get('subordinate_city')?.value).toBe(null);
    expect(form.get('subordinate_state')?.value).toBe(null);
    expect(form.get('subordinate_zip')?.value).toBe(null);
    expect(transaction.contact_5).toBeFalsy();
  });

  it('corrects contact changes for IE Presidential Races', () => {
    const transaction = getTestTransactionByType(ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE) as SchETransaction;
    const formProperties = transaction.transactionType.getFormControlNames();
    const formBuilder = new FormBuilder();
    const form = formBuilder.group(SchemaUtils.getFormGroupFields(formProperties));
    transaction.contact_2 = Contact.fromJSON({
      first_name: 'Changed',
      candidate_state: 'GA',
    });

    form.patchValue({
      // Form fields
      payee_street_1: 'Street 1',
      payee_street_2: 'Street 2',
      payee_city: 'City',
      payee_state: 'AK',
      payee_zip: '54321',
      payee_organization_name: 'Org Name',
      so_candidate_id_number: 'P000000000',
      so_candidate_last_name: 'Last',
      so_candidate_first_name: 'First',
      so_candidate_office: CandidateOfficeTypes.PRESIDENTIAL,
      so_candidate_state: 'AK',
      election_code: 'P1912',
    });

    const changes = TransactionContactUtils.getContactChanges(
      form,
      transaction.contact_2,
      transaction.transactionType.templateMap,
      transaction.transactionType.contactConfig['contact_2'],
      transaction,
    );

    expect(Object.values(changes)).toContain(['candidate_state', null]);

    // By changing the election code, the candidate_state should no longer be excluded from the contact data
    form.patchValue({ election_code: 'S1912' });
    const changesB = TransactionContactUtils.getContactChanges(
      form,
      transaction.contact_2,
      transaction.transactionType.templateMap,
      transaction.transactionType.contactConfig['contact_2'],
      transaction,
    );

    expect(Object.values(changesB)).toContain(['candidate_state', 'AK']);

    form.patchValue({
      so_candidate_office: CandidateOfficeTypes.SENATE,
      election_code: 'P1912',
    });
    const changesC = TransactionContactUtils.getContactChanges(
      form,
      transaction.contact_2,
      transaction.transactionType.templateMap,
      transaction.transactionType.contactConfig['contact_2'],
      transaction,
    );

    expect(Object.values(changesC)).toContain(['candidate_state', 'AK']);
  });
});
