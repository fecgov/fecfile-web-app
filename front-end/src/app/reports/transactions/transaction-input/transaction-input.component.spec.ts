import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInputComponent } from './transaction-input.component';

describe('TransactionInputComponent', () => {
  let component: TransactionInputComponent;
  let fixture: ComponentFixture<TransactionInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionInputComponent]
    });
    fixture = TestBed.createComponent(TransactionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
