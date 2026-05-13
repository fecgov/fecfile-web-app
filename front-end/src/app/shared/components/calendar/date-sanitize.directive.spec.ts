import { NgControl } from '@angular/forms';
import { DateSanitizerDirective, DSN } from './date-sanitize.directive';
import { DateUtils } from 'app/shared/utils/date.utils';
import { TestBed } from '@angular/core/testing';

describe('DateSanitizerDirective', () => {
  let capturedSanitizerFn: (value: DSN) => void;
  const mockValueAccessor = {
    registerOnChange: vi.fn((fn: (val: DSN) => void) => {
      capturedSanitizerFn = fn;
    }),
  };

  const mockOriginalUpdateFn = vi.fn();
  const emitFromUI = (value: DSN) => capturedSanitizerFn(value);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateSanitizerDirective,
        {
          provide: NgControl,
          useValue: { valueAccessor: mockValueAccessor },
        },
      ],
    });

    TestBed.inject(DateSanitizerDirective);
    mockValueAccessor.registerOnChange(mockOriginalUpdateFn);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should sanitize placeholder text "MM/DD/YYYY" to null', () => {
    emitFromUI('MM/DD/YYYY');
    expect(mockOriginalUpdateFn).toHaveBeenCalledWith(null);
  });

  it('should sanitize empty strings to null', () => {
    emitFromUI('');
    expect(mockOriginalUpdateFn).toHaveBeenCalledWith(null);
  });

  it('should call DateUtils.parseDate for complete date strings', () => {
    const rawValue = '01/01/2024';
    const parsedDate = new Date(2024, 0, 1);
    const spy = vi.spyOn(DateUtils, 'parseDate').mockReturnValue(parsedDate);

    emitFromUI(rawValue);

    expect(spy).toHaveBeenCalledWith(rawValue);
    expect(mockOriginalUpdateFn).toHaveBeenCalledWith(parsedDate);
  });

  it('should pass through values containing mask placeholders (M, D, Y)', () => {
    const partialValue = '01/DD/YYYY';
    const spy = vi.spyOn(DateUtils, 'parseDate');

    emitFromUI(partialValue);

    expect(spy).not.toHaveBeenCalled();
    expect(mockOriginalUpdateFn).toHaveBeenCalledWith(partialValue);
  });

  it('should return original value if parsing fails', () => {
    const invalidValue = '99/99/9999';
    vi.spyOn(DateUtils, 'parseDate').mockReturnValue(null);

    emitFromUI(invalidValue);

    expect(mockOriginalUpdateFn).toHaveBeenCalledWith(invalidValue);
  });
});
