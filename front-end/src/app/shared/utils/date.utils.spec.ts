import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  it('should create an instance', () => {
    expect(new DateUtils()).toBeTruthy();
  });

  it('#convertDateToFecFormat(date: Date | null) should return a YYYYMMDD string', () => {
    const dateDate: Date = new Date('December 17, 1995 03:24:00');
    let stringDate: string | null;

    stringDate = DateUtils.convertDateToFecFormat(null);
    expect(stringDate).toBeNull();

    stringDate = DateUtils.convertDateToFecFormat(dateDate);
    expect(stringDate).toBe('19951217');
  });
});
