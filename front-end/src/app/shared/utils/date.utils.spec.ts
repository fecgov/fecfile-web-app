import { DateUtils } from './date.utils';

import { buildAfterDateValidator } from './validators.utils';
import { SubscriptionFormControl } from './subscription-form-control';

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

  it('#convertDateToSlashFormat(date: Date | null) should return a MM/DD/YYYY string', () => {
    const dateDate: Date = new Date('December 17, 1995 03:24:00');
    let stringDate: string | null | undefined;

    stringDate = DateUtils.convertDateToSlashFormat(null);
    expect(stringDate).toBeNull();

    stringDate = DateUtils.convertDateToSlashFormat(dateDate);
    expect(stringDate).toBe('12/17/1995');
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

  describe('dateBefore', () => {
    it('should not check if either date is null', () => {
      const otherControl = new SubscriptionFormControl<Date>(new Date());
      const control = new SubscriptionFormControl<Date>(new Date(), [buildAfterDateValidator(otherControl)]);
      otherControl.setValue(null);
      control.updateValueAndValidity();
      expect(control.valid).toBeTrue();

      otherControl.setValue(new Date());
      control.setValue(null);
      control.updateValueAndValidity();
      expect(control.valid).toBeTrue();
    });

    it("should verify that the control's date comes after the date of the other control", () => {
      const otherControl = new SubscriptionFormControl<Date>(new Date(2024, 1, 2));
      const control = new SubscriptionFormControl<Date>(new Date(2024, 1, 1), {
        validators: [buildAfterDateValidator(otherControl)],
        nonNullable: true,
      });
      control.updateValueAndValidity();
      expect(control.valid).toBeFalse();
      if (!control.errors) throw new Error('Bad test');
      expect(control.errors['isAfter']).not.toBeNull();
      control.setValue(new Date(2024, 1, 3));
      expect(control.valid).toBeTrue();
    });
  });

  describe('isCurrentMonthJanuary', () => {
    it('should return true if the current month is January', () => {
      spyOn(Date.prototype, 'getMonth').and.returnValue(0); // January
      const result = DateUtils.isCurrentMonthJanuary();
      expect(result).toBe(true);
    });

    it('should return false if the current month is not January', () => {
      spyOn(Date.prototype, 'getMonth').and.returnValue(1); // February
      const result = DateUtils.isCurrentMonthJanuary();
      expect(result).toBe(false);
    });
  });
});
