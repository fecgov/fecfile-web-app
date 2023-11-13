import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { AggregationGroups } from '../transaction.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT extends SchATransactionType {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT
  );
  schema = schema;
  override subTransactionConfig = new SubTransactionGroup(
    'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account Memo',
    [
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    ]
  );
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Pres. Nominating Convention Account Transfer of JF Proceeds';
  }

  getNewTransaction(properties = {}) {
    return SchATransaction.fromJSON({
      ...{
        form_type: 'SA17',
        transaction_type_identifier: ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
        aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
      },
      ...properties,
    });
  }
}
