import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { LoanTermsInputComponent } from './loan-terms-input.component';

describe('LoanTermsInputComponent', () => {
  let component: LoanTermsInputComponent;
  let fixture: ComponentFixture<LoanTermsInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanTermsInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanTermsInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.form = new FormGroup({
      [testTemplateMap.date]: new FormControl(''),
      load_due_date: new FormControl(''),
      loan_interest_rate: new FormControl(''),
      secured: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid INCURRED DATE input if outside the report date range', () => {
    const control = component.form.get(component.templateMap.date);
    expect(control?.status).toBe('VALID');
    control?.setValue(new Date('January 1, 2015 00:00:00'));
    expect(control?.status).toBe('INVALID');
    control?.setValue(new Date('June 1, 2022 00:00:00'));
    expect(control?.status).toBe('VALID');
  });
});
