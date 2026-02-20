import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_MEMOS';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import {
  INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS,
  ORGANIZATION_INDIVIDUAL_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { ABSTRACT_SCHEDULE_B_MEMO } from './ABSTRACT_SCHEDULE_B_MEMO.model';
import { ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes, AggregationGroups } from '../type-enums';

export class OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO extends ABSTRACT_SCHEDULE_B_MEMO {
  formFields = INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS;
  override contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO,
  );
  schema = schema;
  override navigationControls = CHILD_CONTROLS;
  override readonly initializationData = {
    form_type: 'SB21B',
    transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO,
    aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
  };
}
