import { TestBed } from '@angular/core/testing';
import { TransactionGroupE } from './transaction-group-e';

describe('TransactionGroupE', () => {
  let component: TransactionGroupE;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupE,],
    });

    component = TestBed.inject(TransactionGroupE);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
