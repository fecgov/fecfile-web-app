import { MemoText } from './memo-text.model';

describe('MemoText', () => {
  it('should create an instance', () => {
    expect(new MemoText()).toBeTruthy();
  });

  it('#fromJSON() should return a populated MemoText class', () => {
    const data = {
      id: 999,
      report_id: 123,
      rec_type: 'test_rec_type',
      text4000: 'test_text',
    };
    const memoText: MemoText = MemoText.fromJSON(data);
    expect(memoText).toBeInstanceOf(MemoText);
    expect(memoText.id).toBe(999);
    expect(memoText.report_id).toBe(123);
    expect(memoText.rec_type).toBe('test_rec_type');
    expect(memoText.text4000).toBe('test_text');
  });
});
