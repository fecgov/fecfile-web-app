import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanTermsInputComponent } from './loan-terms-input.component';

describe('LoanTermsInputComponent', () => {
  let component: LoanTermsInputComponent;
  let fixture: ComponentFixture<LoanTermsInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanTermsInputComponent],
    });
    fixture = TestBed.createComponent(LoanTermsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
