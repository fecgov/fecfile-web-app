import { FormGroup } from '@angular/forms';
import { Transaction } from '../models/transaction.model';
import { SchATransaction } from '../models/scha-transaction.model';
import { SchBTransaction } from '../models/schb-transaction.model';
import { ReattRedesTypes } from 'app/shared/models/reattribution-redesignation/reattribution-redesignation-base.model';
import { ReattributionTo } from '../models/reattribution-redesignation/reattribution-to.model';
import { ReattributionFrom } from '../models/reattribution-redesignation/reattribution-from.model';

export class ReattRedesUtils {
  public static isReattRedes(transaction: Transaction | undefined, types: ReattRedesTypes[] = []): boolean {
    if (!transaction || !('reattribution_redesignation_tag' in transaction)) return false;
    if (types.length === 0) return !!transaction.reattribution_redesignation_tag;
    return types.includes(transaction.reattribution_redesignation_tag as ReattRedesTypes);
  }

  public static overlayTransactionProperties(
    transaction: SchATransaction | SchBTransaction
  ): SchATransaction | SchBTransaction {
    switch (transaction.reattribution_redesignation_tag) {
      case ReattRedesTypes.REATTRIBUTION_TO:
        transaction = new ReattributionTo().overlayTransactionProperties(transaction as SchATransaction);
        break;
      case ReattRedesTypes.REATTRIBUTION_FROM:
        transaction = new ReattributionFrom().overlayTransactionProperties(transaction as SchATransaction);
        break;
    }
    return transaction;
  }

  public static overlayForms(
    toForm: FormGroup,
    toTransaction: SchATransaction | SchBTransaction,
    fromForm: FormGroup,
    fromTransaction: SchATransaction | SchBTransaction
  ): void {
    if (toTransaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_TO) {
      new ReattributionTo().overlayForm(toForm, toTransaction as SchATransaction);
      new ReattributionFrom().overlayForm(fromForm, fromTransaction as SchATransaction, toForm);
    }
  }

  public static getPayloads(payload: Transaction): (SchATransaction | SchBTransaction)[] {
    const orig = payload.reatt_redes as SchATransaction | SchBTransaction;
    const from = payload.children[0] as SchATransaction | SchBTransaction;
    const to = payload as SchATransaction | SchBTransaction;
    to.children = [];
    return [orig, to, from];
  }
}
