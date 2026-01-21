import { TransactionIdPipe } from './transaction-id.pipe';

describe('TransactionIdPipe', () => {
  let pipe: TransactionIdPipe;

  beforeEach(() => {
    pipe = new TransactionIdPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms should return the correctly formatted value', () => {
    expect(pipe.transform('271da73858hj841')).toBe('271DA738');
  });

  it('returns empty for missing value', () => {
    expect(pipe.transform(undefined)).toBe('');
  });
});
