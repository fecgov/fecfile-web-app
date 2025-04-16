import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { testContact, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { DesignatedSubordinateInputComponent } from './designated-subordinate-input.component';

import { SubscriptionFormControl } from 'app/shared/utils/signal-form-control';
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
        designating_committee_id_number: new SubscriptionFormControl(null),
        designating_committee_name: new SubscriptionFormControl(null),
        subordinate_committee_id_number: new SubscriptionFormControl(null),
        subordinate_committee_name: new SubscriptionFormControl(null),
        subordinate_street_1: new SubscriptionFormControl(null),
        subordinate_street_2: new SubscriptionFormControl(null),
        subordinate_city: new SubscriptionFormControl(null),
        subordinate_state: new SubscriptionFormControl(null),
        subordinate_zip: new SubscriptionFormControl(null),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onSubordinateCommitteeIdBlur should update subordinate form value/validity on subordinate committee id blur', () => {
    const formUpdateValueAndValiditySpy = spyOn(component.form, 'updateValueAndValidity');
    component.onSubordinateCommitteeIdBlur();
    expect(formUpdateValueAndValiditySpy).toHaveBeenCalledTimes(8);
  });

  it('#onDesignatedOrSubordinateChange should clear subordinate committee on true', () => {
    const clearSubordinateCommitteeSpy = spyOn(component, 'clearSubordinateCommittee');
    component.onDesignatedOrSubordinateChange(true);
    expect(clearSubordinateCommitteeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onDesignatedOrSubordinateChange should clear designating committee on false', () => {
    const clearDesignatingCommitteeSpy = spyOn(component, 'clearDesignatingCommittee');
    component.onDesignatedOrSubordinateChange(false);
    expect(clearDesignatingCommitteeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onDesignatedOrSubordinateChange should clear designating and subordinate committee on null', () => {
    const clearSubordinateCommitteeSpy = spyOn(component, 'clearSubordinateCommittee');
    const clearDesignatingCommitteeSpy = spyOn(component, 'clearDesignatingCommittee');
    component.onDesignatedOrSubordinateChange(null);
    expect(clearSubordinateCommitteeSpy).toHaveBeenCalledTimes(1);
    expect(clearDesignatingCommitteeSpy).toHaveBeenCalledTimes(1);
  });

  it('#onDesignatingCommitteeSelect should set designating committee', () => {
    const designatingCommitteeSelectEmitSpy = spyOn(component.designatingCommitteeSelect, 'emit');
    const selectItem = {
      label: '',
      value: testContact,
      styleClass: '',
      icon: '',
      title: '',
      disabled: false,
    };
    component.onDesignatingCommitteeSelect(selectItem);
    expect(designatingCommitteeSelectEmitSpy).toHaveBeenCalledWith(selectItem);
  });

  it('#clearDesignatingCommittee should clear subordinate committee', () => {
    const designatingCommitteeClearEmitSpy = spyOn(component.designatingCommitteeClear, 'emit');
    component.clearDesignatingCommittee();
    expect(designatingCommitteeClearEmitSpy).toHaveBeenCalledTimes(1);
  });

  it('#onSubordinateCommitteeSelect should set subordinate committee', () => {
    const subordinateCommitteeSelectEmitSpy = spyOn(component.subordinateCommitteeSelect, 'emit');
    const selectItem = {
      label: '',
      value: testContact,
      styleClass: '',
      icon: '',
      title: '',
      disabled: false,
    };
    component.onSubordinateCommitteeSelect(selectItem);
    expect(subordinateCommitteeSelectEmitSpy).toHaveBeenCalledWith(selectItem);
  });

  it('#clearSubordinateCommittee should clear subordinate committee', () => {
    const subordinateCommitteeClearEmitSpy = spyOn(component.subordinateCommitteeClear, 'emit');
    component.clearSubordinateCommittee();
    expect(subordinateCommitteeClearEmitSpy).toHaveBeenCalledTimes(1);
  });
});
