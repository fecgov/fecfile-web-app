import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAgreementInputComponent } from './loan-agreement-input.component';

describe('LoanAgreementInputComponent', () => {
  let component: LoanAgreementInputComponent;
  let fixture: ComponentFixture<LoanAgreementInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanAgreementInputComponent],
    });
    fixture = TestBed.createComponent(LoanAgreementInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
