import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { DesignatedSubordinateInputComponent } from './designated-subordinate-input.component';

import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

describe('DesignatedSubordinateInputComponent', () => {
  let component: DesignatedSubordinateInputComponent;
  let fixture: ComponentFixture<DesignatedSubordinateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DesignatedSubordinateInputComponent,
        SelectModule,
        InputTextModule,
        ReactiveFormsModule,
        ErrorMessagesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignatedSubordinateInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        filer_designated_to_make_coordinated_expenditures: new SubscriptionFormControl(''),
        designating_committee_id_number: new SubscriptionFormControl(''),
        designating_committee_name: new SubscriptionFormControl(''),
        subordinate_committee_id_number: new SubscriptionFormControl(''),
        subordinate_committee_name: new SubscriptionFormControl(''),
        subordinate_street_1: new SubscriptionFormControl(''),
        subordinate_street_2: new SubscriptionFormControl(''),
        subordinate_city: new SubscriptionFormControl(''),
        subordinate_state: new SubscriptionFormControl(''),
        subordinate_zip: new SubscriptionFormControl(''),
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
