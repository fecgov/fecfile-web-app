import { CurrencyPipe } from '@angular/common';
import { DynamicPipe } from './dynamic.pipe';
import { MemoCodePipe } from './memo-code.pipe';
import { FecDatePipe } from './fec-date.pipe';
import { TestBed } from '@angular/core/testing';

describe('DynamicPipe', () => {
  let pipe: DynamicPipe;
  let currencyPipeMock: jasmine.SpyObj<CurrencyPipe>;
  let memoCodePipeMock: jasmine.SpyObj<MemoCodePipe>;
  let fecDatePipeMock: jasmine.SpyObj<FecDatePipe>;

  beforeEach(() => {
    currencyPipeMock = jasmine.createSpyObj('CurrencyPipe', ['transform']);
    memoCodePipeMock = jasmine.createSpyObj('MemoCodePipe', ['transform']);
    fecDatePipeMock = jasmine.createSpyObj('FecDatePipe', ['transform']);

    TestBed.configureTestingModule({
      providers: [
        DynamicPipe,
        { provide: CurrencyPipe, useValue: currencyPipeMock },
        { provide: MemoCodePipe, useValue: memoCodePipeMock },
        { provide: FecDatePipe, useValue: fecDatePipeMock },
      ],
    });
    pipe = TestBed.inject(DynamicPipe);
  });

  it('Should transform currency', () => {
    const value = 1000;
    const args = ['USD', '1.2-2'];
    currencyPipeMock.transform.and.returnValue('$1000.00');

    const result = pipe.transform(value, 'currency', args);
    expect(result).toBe('$1000.00');
    expect(currencyPipeMock.transform).toHaveBeenCalledWith(value, ...args);
  });

  it('Should transform memoCode', () => {
    const value = true;
    memoCodePipeMock.transform.and.returnValue('Y');

    const result = pipe.transform(value, 'memoCode');
    expect(result).toBe('Y');
    expect(memoCodePipeMock.transform).toHaveBeenCalledWith(value);
  });

  it('Should transform fecDate', () => {
    const value = new Date('2026-01-01');
    fecDatePipeMock.transform.and.returnValue('01/01/2026');

    const result = pipe.transform(value, 'fecDate');
    expect(result).toBe('01/01/2026');
    expect(fecDatePipeMock.transform).toHaveBeenCalledWith(value);
  });

  it('Should return the same value when no valid PipeType is provided', () => {
    const value = 'sameValue';
    const result = pipe.transform(value, 'invalidPipeType');
    expect(result).toBe(value);
  });

  it('Should return the same value when PipeType is undefined', () => {
    const value = 'sameValue';
    const result = pipe.transform(value, undefined);
    expect(result).toBe(value);
  });
});
