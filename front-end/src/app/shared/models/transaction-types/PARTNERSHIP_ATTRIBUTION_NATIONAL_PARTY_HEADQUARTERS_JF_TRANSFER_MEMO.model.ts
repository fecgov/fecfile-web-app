import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { INDIVIDUAL, INDIVIDUAL_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO extends SchATransactionType {
  formFields = INDIVIDUAL_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
  );
  override updateParentOnSave = true;
  schema = schema;
  override shortName = 'Partnership Attribution';
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(transaction: SchATransaction): string {
    let committeeClause = `Headquarters Buildings Account JF Memo: ${
      (transaction.parent_transaction?.parent_transaction as SchATransaction).contributor_organization_name
    }`;
    const parenthetical = ' (Partnership Attribution)';
    if ((committeeClause + parenthetical).length > 100) {
      committeeClause = committeeClause.slice(0, 97 - parenthetical.length) + '...';
    }
    return committeeClause + parenthetical;
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
