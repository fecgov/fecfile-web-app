import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import { ORGANIZATION_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT extends SchATransactionType {
  formFields = ORGANIZATION_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Headquarters Buildings Account';
  }

  override get isReattributable(): boolean {
    return false;
  }

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
