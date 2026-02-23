/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ScheduleIds } from '../models/type-enums';
import { TransactionTypeUtils } from './transaction-type.utils';
import type { TransactionType } from '../models/transaction-type.model';
import type { ScheduleTransaction, Transaction } from '../models/transaction.model';

export class TransactionUtils {
  /**
   * Returns a schedule object of the correct class as discovered by examining
   * the scheduleId of the transaction type.
   *
   * @param json
   * @param depth
   * @returns
   */
  static async getFromJSON(json: any, depth = 2): Promise<ScheduleTransaction> {
    if (json.line_label) json.line_label = json.line_label.replace(/^0+/, '');

    const transactionType = json.transaction_type_identifier
      ? await TransactionTypeUtils.factory(json.transaction_type_identifier)
      : undefined;
    return getfromJsonByType(json, transactionType, depth);
  }

  static async createNewTransaction(transactionType: TransactionType, depth = 2): Promise<ScheduleTransaction> {
    return getfromJsonByType(transactionType.initializationData, transactionType, depth);
  }

  static async createNewTransactionByIdentifier(
    transactionTypeIdentifier: string,
    depth = 2,
  ): Promise<ScheduleTransaction> {
    const transactionType = await TransactionTypeUtils.factory(transactionTypeIdentifier);
    return this.createNewTransaction(transactionType, depth);
  }

  static async hydrateTransaction<T extends Transaction>(json: any, cls: ClassConstructor<T>, depth = 2): Promise<T> {
    const transactionType = json.transaction_type_identifier
      ? await TransactionTypeUtils.factory(json.transaction_type_identifier)
      : undefined;
    return this.hydrateTransactionFromType(json, cls, transactionType, depth);
  }

  static async hydrateTransactionFromType<T extends Transaction>(
    json: any,
    cls: ClassConstructor<T>,
    transactionType: TransactionType | undefined,
    depth = 2,
  ): Promise<T> {
    let transaction = plainToInstance(cls, json);
    if (transactionType) transaction.setMetaProperties(transactionType);

    if (depth > 0 && transaction.parent_transaction) {
      transaction.parent_transaction = await this.getFromJSON(transaction.parent_transaction, depth - 1);
    }

    if (depth > 0 && transaction.children) {
      transaction.children = await Promise.all(transaction.children.map((child) => this.getFromJSON(child, depth - 1)));
    }

    if (transaction.transactionType?.scheduleId === ScheduleIds.A) {
      transaction = await applyReattLogic(transaction as any);
    } else if (transaction.transactionType?.scheduleId === ScheduleIds.B) {
      transaction = await applyRedesLogic(transaction as any);
    }

    if (depth > 0 && transaction.reatt_redes) {
      transaction.reatt_redes = await this.getFromJSON(transaction.reatt_redes, depth - 1);
    }

    return transaction;
  }
}

async function getfromJsonByType(
  json: any,
  transactionType: TransactionType | undefined,
  depth: number,
): Promise<ScheduleTransaction> {
  if (transactionType) {
    switch (transactionType.scheduleId) {
      case ScheduleIds.A: {
        const { SchATransaction } = await import('../models/scha-transaction.model');
        return TransactionUtils.hydrateTransactionFromType(json, SchATransaction, transactionType, depth);
      }
      case ScheduleIds.B: {
        const { SchBTransaction } = await import('../models/schb-transaction.model');
        return TransactionUtils.hydrateTransactionFromType(json, SchBTransaction, transactionType, depth);
      }
      case ScheduleIds.C: {
        const { SchCTransaction } = await import('../models/schc-transaction.model');
        return TransactionUtils.hydrateTransactionFromType(json, SchCTransaction, transactionType, depth);
      }
      case ScheduleIds.C1: {
        const { SchC1Transaction } = await import('../models/schc1-transaction.model');
        return TransactionUtils.hydrateTransactionFromType(json, SchC1Transaction, transactionType, depth);
      }
      case ScheduleIds.C2: {
        const { SchC2Transaction } = await import('../models/schc2-transaction.model');
        return TransactionUtils.hydrateTransactionFromType(json, SchC2Transaction, transactionType, depth);
      }
      case ScheduleIds.D: {
        const { SchDTransaction } = await import('../models/schd-transaction.model');
        return TransactionUtils.hydrateTransactionFromType(json, SchDTransaction, transactionType, depth);
      }
      case ScheduleIds.E: {
        const { SchETransaction } = await import('../models/sche-transaction.model');
        return TransactionUtils.hydrateTransactionFromType(json, SchETransaction, transactionType, depth);
      }
      case ScheduleIds.F: {
        const { SchFTransaction } = await import('../models/schf-transaction.model');
        return TransactionUtils.hydrateTransactionFromType(json, SchFTransaction, transactionType, depth);
      }
    }
  }

  // Default fallback (Schedule A)
  const { SchATransaction } = await import('../models/scha-transaction.model');
  return TransactionUtils.hydrateTransaction(json, SchATransaction, depth);
}

async function applyReattLogic(transaction: any): Promise<any> {
  const tag = transaction.reattribution_redesignation_tag;
  if (!tag) return transaction;

  const { ReattRedesTypes } = await import('../utils/reatt-redes/reatt-redes.utils');

  switch (tag) {
    case ReattRedesTypes.REATTRIBUTED: {
      const { ReattributedUtils } = await import('../utils/reatt-redes/reattributed.utils');
      return ReattributedUtils.overlayTransactionProperties(transaction);
    }
    case ReattRedesTypes.REATTRIBUTION_TO: {
      const { ReattributionToUtils } = await import('../utils/reatt-redes/reattribution-to.utils');
      return ReattributionToUtils.overlayTransactionProperties(transaction);
    }
    case ReattRedesTypes.REATTRIBUTION_FROM: {
      const { ReattributionFromUtils } = await import('../utils/reatt-redes/reattribution-from.utils');
      return ReattributionFromUtils.overlayTransactionProperties(transaction);
    }
    default:
      return transaction;
  }
}

async function applyRedesLogic(transaction: any): Promise<any> {
  const tag = transaction.reattribution_redesignation_tag;
  if (!tag) return transaction;

  const { ReattRedesTypes } = await import('../utils/reatt-redes/reatt-redes.utils');

  switch (tag) {
    case ReattRedesTypes.REDESIGNATED: {
      const { RedesignatedUtils } = await import('../utils/reatt-redes/redesignated.utils');
      return RedesignatedUtils.overlayTransactionProperties(transaction);
    }
    case ReattRedesTypes.REDESIGNATION_TO: {
      const { RedesignationToUtils } = await import('../utils/reatt-redes/redesignation-to.utils');
      return RedesignationToUtils.overlayTransactionProperties(transaction);
    }
    case ReattRedesTypes.REDESIGNATION_FROM: {
      const { RedesignationFromUtils } = await import('../utils/reatt-redes/redesignation-from.utils');
      return RedesignationFromUtils.overlayTransactionProperties(transaction);
    }
    default:
      return transaction;
  }
}
