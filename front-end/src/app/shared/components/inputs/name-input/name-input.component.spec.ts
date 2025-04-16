import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

import { NameInputComponent } from './name-input.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { SubscriptionFormControl } from 'app/shared/utils/signal-form-control';

describe('NameInputComponent', () => {
  let component: NameInputComponent;
  let fixture: ComponentFixture<NameInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextModule, ReactiveFormsModule, NameInputComponent, ErrorMessagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NameInputComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.form = new FormGroup(
      {
        contributor_last_name: new SubscriptionFormControl(''),
        contributor_first_name: new SubscriptionFormControl(''),
        contributor_middle_name: new SubscriptionFormControl(''),
        contributor_prefix: new SubscriptionFormControl(''),
        contributor_suffix: new SubscriptionFormControl(''),
        treasurer_last_name: new SubscriptionFormControl(''),
        treasurer_first_name: new SubscriptionFormControl(''),
        treasurer_middle_name: new SubscriptionFormControl(''),
        treasurer_prefix: new SubscriptionFormControl(''),
        treasurer_suffix: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
    fixture.detectChanges();
  });

  it('should create default', () => {
    expect(component).toBeTruthy();
  });

  it('should create signatory_1', () => {
    component.templateMapKeyPrefix = 'signatory_1';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
