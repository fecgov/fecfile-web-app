import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  it('should create an instance', () => {
    expect(new DateUtils()).toBeTruthy();
  });

  it('#convertDateToFecFormat(date: Date | null) should return a YYYY-MM-DD string', () => {
    const dateDate: Date = new Date('December 17, 1995 03:24:00');
    let stringDate: string | null;

    stringDate = DateUtils.convertDateToFecFormat(null);
    expect(stringDate).toBeNull();

    stringDate = DateUtils.convertDateToFecFormat(dateDate);
    expect(stringDate).toBe('1995-12-17');
  });

  it('#areOverlapping should detect overlaps', () => {
    const januaryFirst = new Date('01/01/2023');
    const januarySecond = new Date('01/02/2023');
    const januaryThird = new Date('01/03/2023');
    const januaryForth = new Date('01/04/2023');
    const decemberFirstLastYear = new Date('12/01/2022');
    // A1----B1----A2----B2
    expect(DateUtils.areOverlapping(januaryFirst, januaryThird, januarySecond, januaryForth)).toBeTrue();
    // B1----A1----B2----A2
    expect(DateUtils.areOverlapping(januarySecond, januaryForth, januaryFirst, januaryThird)).toBeTrue();
    // A1----A2B1----B2
    expect(DateUtils.areOverlapping(januaryFirst, januarySecond, januarySecond, januaryThird)).toBeTrue();
    // A1--(new-year)--B1----A2----B2
    expect(DateUtils.areOverlapping(decemberFirstLastYear, januarySecond, januaryFirst, januaryThird)).toBeTrue();
    // B1----A1----A2----B2
    expect(DateUtils.areOverlapping(januarySecond, januaryThird, januaryFirst, januaryForth)).toBeTrue();

    // A1----A2----B1----B2
    expect(DateUtils.areOverlapping(decemberFirstLastYear, januaryFirst, januaryThird, januaryForth)).toBeFalse();
    // B1--(new-year)--B2----A1----A2
    expect(DateUtils.areOverlapping(januaryThird, januaryForth, decemberFirstLastYear, januaryFirst)).toBeFalse();

    // undefined
    expect(DateUtils.areOverlapping(undefined, januaryFirst, januaryThird, januaryForth)).toBeFalse();
  });

  it('#isWithin should detect dates within range', () => {
    const januaryFirst = new Date('01/01/2023');
    const januarySecond = new Date('01/02/2023');
    const januaryThird = new Date('01/03/2023');
    const decemberFirstLastYear = new Date('12/01/2022');
    // F----D----T
    expect(DateUtils.isWithin(januarySecond, januaryFirst, januaryThird)).toBeTrue();
    // FD----T
    expect(DateUtils.isWithin(januaryFirst, januaryFirst, januaryThird)).toBeTrue();
    // F--(new-year)--D----T
    expect(DateUtils.isWithin(januaryFirst, decemberFirstLastYear, januarySecond)).toBeTrue();

    // D----F----T
    expect(DateUtils.isWithin(januaryFirst, januarySecond, januaryThird)).toBeFalse();
    // F----T----D
    expect(DateUtils.isWithin(januaryThird, januaryFirst, januarySecond)).toBeFalse();

    // undefined
    expect(DateUtils.areOverlapping(undefined, januaryFirst, januaryThird)).toBeFalse();
  });
});
