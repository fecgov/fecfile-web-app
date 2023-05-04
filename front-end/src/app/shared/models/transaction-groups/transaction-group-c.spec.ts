import { TestBed } from '@angular/core/testing';
import { TransactionGroupC } from './transaction-group-c';

describe('TransactionGroupC', () => {
  let component: TransactionGroupC;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupC,],
    });

    component = TestBed.inject(TransactionGroupC);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
