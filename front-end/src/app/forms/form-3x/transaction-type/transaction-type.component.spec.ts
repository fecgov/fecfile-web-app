import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransactionTypeComponent } from './transaction-type.component';

xdescribe('TransactionTypeComponent', () => {
  let component: TransactionTypeComponent;
  let fixture: ComponentFixture<TransactionTypeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TransactionTypeComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
