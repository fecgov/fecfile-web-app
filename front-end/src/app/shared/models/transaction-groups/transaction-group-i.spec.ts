import { TestBed } from '@angular/core/testing';
import { TransactionGroupI } from './transaction-group-i';

describe('TransactionGroupI', () => {
  let component: TransactionGroupI;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TransactionGroupI,],
    });

    component = TestBed.inject(TransactionGroupI);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
