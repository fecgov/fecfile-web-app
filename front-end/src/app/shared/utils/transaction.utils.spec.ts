import { TransactionUtils } from './transaction.utils';
import { TransactionMeta } from '../interfaces/transaction-meta.interface';

describe('TransactionUtils', () => {
  it('should create an instance', () => {
    expect(new TransactionUtils()).toBeTruthy();
  });

  it('#getMeta() should return a TransactionMeta object', () => {
    const tm: TransactionMeta = TransactionUtils.getMeta('offset_to_opex');
    expect(tm.scheduleId).toBe('A');
    expect(tm.componentGroupId).toBe('B');
    expect(tm.title).toBe('Offsets to Operating Expenditures');
  });
});
