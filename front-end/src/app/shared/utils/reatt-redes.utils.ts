import { FormGroup } from '@angular/forms';
import { Transaction } from '../models/transaction.model';
import { SchATransaction } from '../models/scha-transaction.model';
import { SchBTransaction } from '../models/schb-transaction.model';
import { ReattRedesTypes } from 'app/shared/models/reattribution-redesignation/reattribution-redesignation-base.model';
import { Reattributed } from '../models/reattribution-redesignation/reattributed.model';
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

  public static getPayloads(payload: Transaction): Transaction[] {
    let orig;
    let origCopy; // If needed, a copy of the originating transaction.

    const from = payload.children[0] as SchATransaction | SchBTransaction;
    const to = payload as SchATransaction | SchBTransaction;
    to.children = [];

    // Split up payload into the 3 or 4 separate transaction payloads to save the originating, TO, and FROM transactions
    // and the copy of the originating transaction if the originating is in a different reporting period.
    if (to.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_TO) {
      [orig, origCopy] = new Reattributed().overlayTransactionProperties(
        payload.reatt_redes as SchATransaction,
        to.report_id as string
      );
    }
    // Put REDESIGNATED overlayTransactionProperties here
    // else {}

    if (origCopy) {
      return [orig as Transaction, origCopy, to, from];
    }
    return [orig as Transaction, to, from];
  }
}
