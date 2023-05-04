import { TestBed } from '@angular/core/testing';
import { TransactionGroupM } from './transaction-group-m';

describe('TransactionGroupM', () => {
  let component: TransactionGroupM;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupM,],
    });

    component = TestBed.inject(TransactionGroupM);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
