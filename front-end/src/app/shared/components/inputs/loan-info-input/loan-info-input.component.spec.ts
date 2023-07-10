import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInfoInputComponent } from './loan-info-input.component';

describe('LoanInfoInputComponent', () => {
  let component: LoanInfoInputComponent;
  let fixture: ComponentFixture<LoanInfoInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanInfoInputComponent]
    });
    fixture = TestBed.createComponent(LoanInfoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
