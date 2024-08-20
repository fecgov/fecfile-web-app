import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { LoanInfoInputComponent } from './loan-info-input.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';

describe('LoanInfoInputComponent', () => {
  let component: LoanInfoInputComponent;
  let fixture: ComponentFixture<LoanInfoInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [LoanInfoInputComponent],
      providers: [provideMockStore(testMockStore)],
    });
    fixture = TestBed.createComponent(LoanInfoInputComponent);
    component = fixture.componentInstance;

    // Set up component with form control
    const form = new FormGroup(
      {
        loan_amount: new FormControl(),
        total_balance: new FormControl(),
        loan_payment_to_date: new FormControl(),
        memo_code: new FormControl(),
      },
      { updateOn: 'blur' },
    );
    component.form = form;
    component.templateMap = {
      ...testTemplateMap,
      ...{
        amount: 'loan_amount',
        balance: 'total_balance',
        payment_to_date: 'loan_payment_to_date',
        memo_code: 'memo_code',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
