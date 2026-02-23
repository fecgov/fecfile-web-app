import { SchBTransaction } from './schb-transaction.model';
import { ReattRedesTypes } from '../utils/reatt-redes/reatt-redes.utils';
import { RedesignationFromUtils } from '../utils/reatt-redes/redesignation-from.utils';
import { RedesignationToUtils } from '../utils/reatt-redes/redesignation-to.utils';
import { testScheduleBTransaction } from '../utils/unit-test.utils';
import { RedesignatedUtils } from '../utils/reatt-redes/redesignated.utils';
import { ScheduleBTransactionTypes } from './type-enums';
import { TransactionUtils } from '../utils/transaction.utils';

describe('SchBTransaction', () => {
  it('should create an instance', () => {
    expect(new SchBTransaction()).toBeTruthy();
  });

  it('Creates a transaction object from JSON', async () => {
    const json = {
      transaction_type_identifier: 'RETURN_RECEIPT',
      parent_transaction: {
        transaction_type_identifier: 'RETURN_RECEIPT',
      },
      children: [
        {
          transaction_type_identifier: 'RETURN_RECEIPT',
        },
      ],
    };
    const transaction: SchBTransaction = await TransactionUtils.hydrateTransaction(json, SchBTransaction);
    expect(transaction.constructor.name).toBe('SchBTransaction');
  });

  describe('redesignation from json', () => {
    it('should create reattribution_redesignation from json', async () => {
      const baseOverlaySpy = spyOn(RedesignatedUtils, 'overlayTransactionProperties').and.callThrough();

      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATED,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      await TransactionUtils.hydrateTransaction(json, SchBTransaction);
      expect(baseOverlaySpy).toHaveBeenCalledTimes(1);
    });

    it('should create REDESIGNATED from json', async () => {
      const overlaySpy = spyOn(RedesignatedUtils, 'overlayTransactionProperties').and.callThrough();

      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATED,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      await TransactionUtils.hydrateTransaction(json, SchBTransaction);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
    });

    it('should create REDESIGNATION_FROM from json', async () => {
      const overlaySpy = spyOn(RedesignationFromUtils, 'overlayTransactionProperties').and.callThrough();
      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATION_FROM,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      await TransactionUtils.hydrateTransaction(json, SchBTransaction);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
    });

    it('should create REDESIGNATION_TO from json', async () => {
      const overlaySpy = spyOn(RedesignationToUtils, 'overlayTransactionProperties').and.callThrough();
      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATION_TO,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      await TransactionUtils.hydrateTransaction(json, SchBTransaction);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
    });

    it('should create REDESIGNATION_TO from json', async () => {
      const txn = await testScheduleBTransaction();
      const overlaySpy = spyOn(RedesignationToUtils, 'overlayTransactionProperties').and.callFake((trans) => {
        trans.reatt_redes = txn;
        return trans;
      });
      const json = {
        transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        reattribution_redesignation_tag: ReattRedesTypes.REDESIGNATION_TO,
        parent_transaction: {
          transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
        },
        children: [
          {
            transaction_type_identifier: ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          },
        ],
      };
      const transaction = await TransactionUtils.hydrateTransaction(json, SchBTransaction);
      expect(overlaySpy).toHaveBeenCalledTimes(1);
      expect(transaction.reatt_redes).toBeTruthy();
    });
  });
});
