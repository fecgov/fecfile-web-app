import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DatePicker } from 'primeng/datepicker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DateInput } from './date.input';

describe('DateInput', () => {
  let fixture: ComponentFixture<DateInput>;
  let component: DateInput;
  let datePicker: DatePicker;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateInput],
    })
      .overrideComponent(DateInput, {
        set: {
          template: '<p-datepicker></p-datepicker>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DateInput);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('value', null);
    fixture.componentRef.setInput('label', 'Date');
    fixture.componentRef.setInput('name', 'date');

    fixture.detectChanges();

    datePicker = component.datePicker();
  });

  describe('stringToDateConversion via onInput', () => {
    it('should convert a valid date string to a Date', () => {
      const input = document.createElement('input');
      input.value = '2026-03-15';

      component.onInput({
        target: input,
      } as unknown as InputEvent);

      expect(component.tempValue()).toEqual(new Date('2026-03-15'));
    });

    it('should preserve an invalid date string', () => {
      const input = document.createElement('input');
      input.value = 'not-a-date';

      component.onInput({
        target: input,
      } as unknown as InputEvent);

      expect(component.tempValue()).toBe('not-a-date');
    });

    it('should convert an empty string to null', () => {
      const input = document.createElement('input');
      input.value = '';

      component.onInput({
        target: input,
      } as unknown as InputEvent);

      expect(component.tempValue()).toBeNull();
    });

    it('should convert a whitespace-only string to null', () => {
      const input = document.createElement('input');
      input.value = '   ';

      component.onInput({
        target: input,
      } as unknown as InputEvent);

      expect(component.tempValue()).toBeNull();
    });

    it('should remove the MM/DD/YYYY placeholder suffix', () => {
      const input = document.createElement('input');
      input.value = '03/15/2026MM/DD/YYYY';

      component.onInput({
        target: input,
      } as unknown as InputEvent);

      expect(input.value).toBe('03/15/2026');
      expect(component.tempValue()).toEqual(new Date('03/15/2026'));
    });

    it('should retain a Date passed directly to onDateSelect', () => {
      const date = new Date(2026, 2, 15);

      component.onDateSelect(date);

      expect(component.tempValue()).toBe(date);
    });
  });

  describe('onDateSelect', () => {
    it('should update the value and mark the control as touched', () => {
      const date = new Date(2026, 2, 15);

      component.onDateSelect(date);

      expect(component.value()).toBe(date);
      expect(component.touched()).toBe(true);
    });

    it('should convert a valid string to a Date and commit it', () => {
      component.onDateSelect('2026-03-15');

      expect(component.value()).toEqual(new Date('2026-03-15'));
      expect(component.touched()).toBe(true);
    });

    it('should preserve an invalid date string when committing', () => {
      component.onDateSelect('invalid-date');

      expect(component.value()).toBe('invalid-date');
      expect(component.touched()).toBe(true);
    });

    it('should commit null for an empty string', () => {
      component.onDateSelect('');

      expect(component.value()).toBeNull();
      expect(component.touched()).toBe(true);
    });
  });

  describe('onBlur', () => {
    it('should commit the temporary value when the overlay is closed', async () => {
      vi.useFakeTimers();

      try {
        datePicker.overlayVisible = false;

        component.onInput({
          target: Object.assign(document.createElement('input'), {
            value: '2026-03-15',
          }),
        } as unknown as InputEvent);

        component.onBlur();

        expect(component.value()).toBeNull();

        await vi.runAllTimersAsync();

        expect(component.value()).toEqual(new Date('2026-03-15'));
        expect(component.touched()).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should not commit or mark touched while the overlay is open', async () => {
      vi.useFakeTimers();

      try {
        datePicker.overlayVisible = true;

        component.onInput({
          target: Object.assign(document.createElement('input'), {
            value: '2026-03-15',
          }),
        } as unknown as InputEvent);

        component.onBlur();
        await vi.runAllTimersAsync();

        expect(component.value()).toBeNull();
        expect(component.touched()).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('onCloseOverlay', () => {
    it('should commit the temporary value and mark touched', () => {
      const date = new Date(2026, 2, 15);

      component.tempValue.set(date);
      component.onCloseOverlay();

      expect(component.value()).toBe(date);
      expect(component.touched()).toBe(true);
    });

    it('should mark touched even when the value has not changed', () => {
      component.onCloseOverlay();

      expect(component.value()).toBeNull();
      expect(component.touched()).toBe(true);
    });
  });

  describe('onYearChange', () => {
    it('should increment the year when delta is 1', () => {
      datePicker.currentMonth = 2;
      datePicker.currentYear = 2026;

      const incrementYear = vi.spyOn(datePicker, 'incrementYear');
      const decrementYear = vi.spyOn(datePicker, 'decrementYear');
      const createMonths = vi.spyOn(datePicker, 'createMonths');
      const monthChange = vi.spyOn(datePicker.onMonthChange, 'emit');

      component.onYearChange(new Event('click'), 1);

      expect(datePicker.isMonthNavigate).toBe(true);
      expect(incrementYear).toHaveBeenCalledOnce();
      expect(decrementYear).not.toHaveBeenCalled();
      expect(monthChange).toHaveBeenCalledWith({
        month: datePicker.currentMonth + 1,
        year: datePicker.currentYear,
      });
      expect(createMonths).toHaveBeenCalledWith(datePicker.currentMonth, datePicker.currentYear);
    });

    it('should decrement the year when delta is -1', () => {
      const incrementYear = vi.spyOn(datePicker, 'incrementYear');
      const decrementYear = vi.spyOn(datePicker, 'decrementYear');

      component.onYearChange(new Event('click'), -1);

      expect(decrementYear).toHaveBeenCalledOnce();
      expect(incrementYear).not.toHaveBeenCalled();
    });

    it('should prevent navigation when the date picker is disabled', () => {
      vi.spyOn(datePicker, '$disabled').mockReturnValue(true);

      const event = new Event('click');
      const preventDefault = vi.spyOn(event, 'preventDefault');
      const incrementYear = vi.spyOn(datePicker, 'incrementYear');
      const decrementYear = vi.spyOn(datePicker, 'decrementYear');

      component.onYearChange(event, 1);

      expect(preventDefault).toHaveBeenCalledOnce();
      expect(incrementYear).not.toHaveBeenCalled();
      expect(decrementYear).not.toHaveBeenCalled();
    });
  });

  describe('BaseInput computed properties', () => {
    it('should use the name as the input ID by default', () => {
      expect(component.inputId()).toBe('date');
    });

    it('should use the override ID when provided', () => {
      fixture.componentRef.setInput('overrideId', 'custom-date');
      fixture.detectChanges();

      expect(component.inputId()).toBe('custom-date');
    });

    it('should be optional by default', () => {
      expect(component.optional()).toBe(true);
    });

    it.each([
      { input: 'required', value: true, condition: 'required' },
      { input: 'showOptional', value: false, condition: 'optional labels are hidden' },
      { input: 'disabled', value: true, condition: 'disabled' },
    ])('should not be optional when $condition', ({ input, value }) => {
      fixture.componentRef.setInput(input, value);
      fixture.detectChanges();

      expect(component.optional()).toBe(false);
    });
  });
});
