import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/EARMARK_RECEIPT';
import { ContactTypes } from '../contact.model';
import type { SchATransaction } from '../scha-transaction.model';
import { ABSTRACT_EARMARK } from './ABSTRACT_EARMARK.model';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes, AggregationGroups } from '../type-enums';

export class EARMARK_RECEIPT extends ABSTRACT_EARMARK {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.EARMARK_RECEIPT);
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleATransactionTypes.EARMARK_MEMO];

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (!transaction.children?.length) return '';
    const earmarkMemo: SchATransaction = transaction.children[0] as SchATransaction;
    let conduit = earmarkMemo.contributor_organization_name || '';
    if (
      earmarkMemo.entity_type === ContactTypes.INDIVIDUAL &&
      earmarkMemo.contributor_first_name &&
      earmarkMemo.contributor_last_name
    ) {
      conduit = `${earmarkMemo.contributor_first_name || ''} ${earmarkMemo.contributor_last_name || ''}`;
    }
    if (conduit) {
      return `Earmarked through ${conduit}`;
    }
    return '';
  }

  override readonly initializationData = {
    form_type: 'SA11AI',
    transaction_type_identifier: ScheduleATransactionTypes.EARMARK_RECEIPT,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
