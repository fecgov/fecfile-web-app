import { CurrencyPipe } from '@angular/common';
import { DynamicPipe } from './dynamic.pipe';
import { MemoCodePipe } from './memo-code.pipe';
import { FecDatePipe } from './fec-date.pipe';
import { TransactionIdPipe } from './transaction-id.pipe';
import { TestBed } from '@angular/core/testing';
import { DefaultZeroPipe } from './default-zero.pipe';

describe('DynamicPipe', () => {
  let pipe: DynamicPipe;
  let currencyPipe: CurrencyPipe;
  let memoCodePipeMock: jasmine.SpyObj<MemoCodePipe>;
  let fecDatePipeMock: jasmine.SpyObj<FecDatePipe>;
  let transactionIdPipeMock: jasmine.SpyObj<TransactionIdPipe>;

  beforeEach(() => {
    memoCodePipeMock = jasmine.createSpyObj('MemoCodePipe', ['transform']);
    fecDatePipeMock = jasmine.createSpyObj('FecDatePipe', ['transform']);
    transactionIdPipeMock = jasmine.createSpyObj('TransactionIdPipe', ['transform']);

    TestBed.configureTestingModule({
      providers: [
        DynamicPipe,
        CurrencyPipe,
        { provide: MemoCodePipe, useValue: memoCodePipeMock },
        { provide: FecDatePipe, useValue: fecDatePipeMock },
        { provide: TransactionIdPipe, useValue: transactionIdPipeMock },
        DefaultZeroPipe,
      ],
    });
    pipe = TestBed.inject(DynamicPipe);
    currencyPipe = TestBed.inject(CurrencyPipe);
  });

  it('Should transform currency', () => {
    const currencySpy = spyOn(currencyPipe, 'transform').and.callThrough();
    const value = 1000;
    const args = ['CAD', 'symbol', '4.2-2'];

    const result = pipe.transform(value, ['currency'], args);
    expect(result).toBe('CA$1,000.00');
    expect(currencySpy).toHaveBeenCalledWith(value, ...args);
  });

  it('Should transform memoCode', () => {
    const value = true;
    memoCodePipeMock.transform.and.returnValue('Y');

    const result = pipe.transform(value, ['memoCode']);
    expect(result).toBe('Y');
    expect(memoCodePipeMock.transform).toHaveBeenCalledWith(value);
  });

  it('Should transform fecDate', () => {
    const value = new Date('2026-01-01');
    fecDatePipeMock.transform.and.returnValue('01/01/2026');

    const result = pipe.transform(value, ['fecDate']);
    expect(result).toBe('01/01/2026');
    expect(fecDatePipeMock.transform).toHaveBeenCalledWith(value);
  });

  it('Should transform transactionId', () => {
    const value = '271da73858hj841';
    transactionIdPipeMock.transform.and.returnValue('271DA738');

    const result = pipe.transform(value, ['transactionId']);
    expect(result).toBe('271DA738');
    expect(transactionIdPipeMock.transform).toHaveBeenCalledWith(value);
  });

  it('Should return the same value when no valid PipeType is provided', () => {
    const value = 'sameValue';
    const result = pipe.transform(value, ['invalidPipeType']);
    expect(result).toBe(value);
  });

  it('Should return the same value when PipeType is undefined', () => {
    const value = 'sameValue';
    const result = pipe.transform(value, undefined);
    expect(result).toBe(value);
  });

  it('Should return the same value when PipeType is []', () => {
    const value = 'sameValue';
    const result = pipe.transform(value, []);
    expect(result).toBe(value);
  });

  it('Should process multiple pipes when multiple sent', () => {
    let result = pipe.transform(undefined, ['currency']);
    expect(result).toBeNull();

    result = pipe.transform(undefined, ['defaultZero']);
    expect(result).toBe(0);

    result = pipe.transform(undefined, ['defaultZero', 'currency']);
    expect(result).toBe('$0.00');
  });
});
