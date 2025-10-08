import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { INDIVIDUAL_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { shortenClause } from '../clause';
import { SCHEDULE_A_MEMO } from './common-types/SCHEDULE_A_MEMO.model';

export class PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO extends SCHEDULE_A_MEMO {
  formFields = INDIVIDUAL_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
  );
  schema = schema;
  override shortName = 'Partnership Attribution';
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(transaction: SchATransaction): string {
    const committeeClause = `Headquarters Buildings Account JF Memo: ${
      (transaction.parent_transaction?.parent_transaction as SchATransaction).contributor_organization_name
    }`;
    const parenthetical = ' (Partnership Attribution)';
    return shortenClause(committeeClause, parenthetical);
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier:
        ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
