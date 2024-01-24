import { FormGroup } from '@angular/forms';
import { Transaction } from 'app/shared/models/transaction.model';
import { MemoText } from 'app/shared/models/memo-text.model';

export class TransactionMemoUtils {
  // prettier-ignore
  static retrieveMemoText(transaction: Transaction, form: FormGroup, formValues: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const text = form.get('text4000')?.value;
      if (text && text.length > 0) {
        const memo_text = MemoText.fromJSON({
          text4000: text,
          text_prefix: transaction.memo_text?.text_prefix,
          report_id: transaction?.report_id,
          rec_type: 'TEXT',
        });
  
        if (transaction?.id) {
          memo_text.transaction_uuid = transaction.id;
        }
  
        formValues['memo_text'] = memo_text;
      } else {
        formValues['memo_text'] = undefined;
      }
  
      return formValues;
    }

  static patchMemoText(transaction: Transaction | undefined, form: FormGroup) {
    const memo_text = transaction?.memo_text;
    if (memo_text?.text4000) {
      form.patchValue({ text4000: memo_text.text4000 });
    }
  }
}
