import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { SignatureInputComponent } from './signature-input.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SubscriptionFormControl } from 'app/shared/utils/signal-form-control';

describe('SignatureInputComponent', () => {
  let component: SignatureInputComponent;
  let fixture: ComponentFixture<SignatureInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SignatureInputComponent],
    });
    fixture = TestBed.createComponent(SignatureInputComponent);
    component = fixture.componentInstance;

    // Set up component with form control
    const form = new FormGroup(
      {
        authorized_last_name: new SubscriptionFormControl(),
        authorized_first_name: new SubscriptionFormControl(),
        authorized_middle_name: new SubscriptionFormControl(),
        authorized_prefix: new SubscriptionFormControl(),
        authorized_suffix: new SubscriptionFormControl(),
        authorized_title: new SubscriptionFormControl(),
        authorized_date_signed: new SubscriptionFormControl(),
      },
      { updateOn: 'blur' },
    );
    component.form = form;
    component.templateMapKeyPrefix = 'signatory_2';
    component.templateMap = {
      ...testTemplateMap,
      ...{
        signatory_2_last_name: 'authorized_last_name',
        signatory_2_first_name: 'authorized_first_name',
        signatory_2_middle_name: 'authorized_middle_name',
        signatory_2_prefix: 'authorized_prefix',
        signatory_2_suffix: 'authorized_suffix',
        signatory_2_title: 'authorized_title',
        signatory_2_date: 'authorized_date_signed',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
