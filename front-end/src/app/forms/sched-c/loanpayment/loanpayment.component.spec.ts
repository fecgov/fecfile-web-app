import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanpaymentComponent } from './loanpayment.component';

xdescribe('LoanpaymentComponent', () => {
  let component: LoanpaymentComponent;
  let fixture: ComponentFixture<LoanpaymentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoanpaymentComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
