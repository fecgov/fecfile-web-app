import { TestBed } from '@angular/core/testing';
import { TransactionGroupAG } from './transaction-group-ag';

describe('TransactionGroupAG', () => {
  let component: TransactionGroupAG;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupAG,],
    });

    component = TestBed.inject(TransactionGroupAG);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
