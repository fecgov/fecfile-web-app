import { TestBed } from '@angular/core/testing';
import { TransactionGroupB } from './transaction-group-b';

describe('TransactionGroupB', () => {
  let component: TransactionGroupB;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupB,],
    });

    component = TestBed.inject(TransactionGroupB);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
