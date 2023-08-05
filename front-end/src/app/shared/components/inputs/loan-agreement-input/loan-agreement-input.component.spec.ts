import { ComponentFixture, TestBed } from '@angular/core/testing';

import { C1LoanInfoInputComponent } from './loan-agreement-input.component';

describe('C1LoanInfoInputComponent', () => {
  let component: C1LoanInfoInputComponent;
  let fixture: ComponentFixture<C1LoanInfoInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [C1LoanInfoInputComponent],
    });
    fixture = TestBed.createComponent(C1LoanInfoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
