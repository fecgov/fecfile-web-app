import { TestBed } from '@angular/core/testing';
import { TransactionGroupD } from './transaction-group-d';

describe('TransactionGroupD', () => {
  let component: TransactionGroupD;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupD,],
    });

    component = TestBed.inject(TransactionGroupD);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
