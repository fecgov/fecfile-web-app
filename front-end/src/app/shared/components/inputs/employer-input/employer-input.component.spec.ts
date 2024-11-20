import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { EmployerInputComponent } from './employer-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

describe('EmployerInputComponent', () => {
  let component: EmployerInputComponent;
  let fixture: ComponentFixture<EmployerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployerInputComponent, ErrorMessagesComponent],
      imports: [InputTextModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        contributor_employer: new SubscriptionFormControl(''),
        contributor_occupation: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
