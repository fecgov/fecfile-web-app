import { TestBed } from '@angular/core/testing';
import { TransactionGroupFG } from './transaction-group-fg';

describe('TransactionGroupFG', () => {
  let component: TransactionGroupFG;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupFG,],
    });

    component = TestBed.inject(TransactionGroupFG);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
