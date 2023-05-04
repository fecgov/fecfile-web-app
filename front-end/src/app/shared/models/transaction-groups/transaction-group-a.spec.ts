import { TestBed } from '@angular/core/testing';
import { TransactionGroupA } from './transaction-group-a';

describe('TransactionGroupA', () => {
  let component: TransactionGroupA;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupA,],
    });

    component = TestBed.inject(TransactionGroupA);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
