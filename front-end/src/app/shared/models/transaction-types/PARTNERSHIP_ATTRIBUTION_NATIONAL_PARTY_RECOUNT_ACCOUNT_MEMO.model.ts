import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_PARTNERSHIP_MEMOS';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { INDIVIDUAL_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { ABSTRACT_SCHEDULE_A_MEMO } from './ABSTRACT_SCHEDULE_A_MEMO.model';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes, AggregationGroups } from '../type-enums';

export class PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO extends ABSTRACT_SCHEDULE_A_MEMO {
  formFields = INDIVIDUAL_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO,
  );
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Recount/Legal Proceedings Account Partnership Attribution';
  }

  override readonly initializationData = {
    form_type: 'SA17',
    transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO,
    aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
  };
}
