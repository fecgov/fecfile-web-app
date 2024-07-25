import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { LoanTermsInputComponent } from './loan-terms-input.component';
import { SharedModule } from 'app/shared/shared.module';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';

describe('LoanTermsInputComponent', () => {
  let component: LoanTermsInputComponent;
  let fixture: ComponentFixture<LoanTermsInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [LoanTermsInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanTermsInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.form = new FormGroup({
      loan_incurred_date: new FormControl(''),
      loan_interest_rate: new FormControl(''),
      loan_due_date: new FormControl(''),
      collateral: new FormControl(''),
    });
    component.templateMap = {
      ...testTemplateMap,
      ...{
        interest_rate: 'loan_interest_rate',
        date: 'loan_incurred_date',
        due_date: 'loan_due_date',
        secured: 'collateral',
      },
    };
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
