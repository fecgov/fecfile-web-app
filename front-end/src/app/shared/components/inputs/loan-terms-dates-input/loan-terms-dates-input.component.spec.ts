import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { LoanTermsDatesInputComponent } from './loan-terms-dates-input.component';
import { SharedModule } from 'app/shared/shared.module';

describe('LoanTermsDatesInputComponent', () => {
  let component: LoanTermsDatesInputComponent;
  let fixture: ComponentFixture<LoanTermsDatesInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [LoanTermsDatesInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanTermsDatesInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.form = new FormGroup({
      [testTemplateMap.date]: new FormControl(''),
      load_due_date: new FormControl(''),
      loan_interest_rate: new FormControl(''),
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
